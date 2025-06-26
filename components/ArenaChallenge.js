import { useState } from "react";
import wildlifejournal from "../public/wildlifejournal.json";

function getArenaBattleAnimals(battleNum) {
  // pool of animals for arena battles (no legendary, stage 1-3 only)
  const pool = wildlifejournal.filter(a => !a.legendary && a.stage <= 3);

  // Define animal count and level ranges for each battle
  const config = [
    { count: 3, min: 1, max: 15 },
    { count: 4, min: 15, max: 30 },
    { count: 6, min: 30, max: 50 }
  ][battleNum];

  return Array.from({ length: config.count }).map(() => {
    const wild = pool[Math.floor(Math.random() * pool.length)];
    // Random level in the range
    const level = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    // Scale HP: base + (level * factor)
    const baseHP = wild.base_hp || wild.hp || 50;
    const hp = Math.round(baseHP + level * 4);
    return {
      ...wild,
      level,
      hp,
      maxhp: hp,
    };
  });
}

export default function ArenaChallenge({ arena, game, setGame, onMedalEarned }) {
  const [stage, setStage] = useState(0); // 0, 1, 2 for the 3 battles
  const [enemyTeam, setEnemyTeam] = useState(() => getArenaBattleAnimals(0));
  const [enemyIdx, setEnemyIdx] = useState(0);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [playerTeam, setPlayerTeam] = useState(game.team.map(a => ({ ...a, hp: a.hp ?? a.maxhp })));
  const [arenaMsg, setArenaMsg] = useState(`Welcome to the ${arena.name}!`);
  const [arenaOver, setArenaOver] = useState(false);
  const [pendingUnlock, setPendingUnlock] = useState(null);

  const enemy = enemyTeam[enemyIdx];
  const player = playerTeam[playerIdx];

  const playerAlive = playerTeam.some(a => a.hp > 0);
  const enemyAlive = enemyTeam.some(a => a.hp > 0);

  function attack(attacker, defender) {
    // Damage scales more strongly with level
    // (level * 1.2 + 10 + small random), minimum 1, cap at defender.hp
    const dmg = Math.max(1, Math.floor(attacker.level * 1.2 + 10 + Math.random() * (attacker.level / 3 + 5)));
    return Math.min(defender.hp, dmg);
  }

  function handlePlayerAttack() {
    if (arenaOver) return;
    if (player.hp <= 0) {
      setArenaMsg("Your animal must have HP to attack!");
      return;
    }
    // Player attacks enemy
    const dmg = attack(player, enemy);
    const newEnemyTeam = enemyTeam.slice();
    newEnemyTeam[enemyIdx] = { ...enemy, hp: Math.max(0, enemy.hp - dmg) };
    setArenaMsg(`You attacked! ${enemy.name} took ${dmg} damage.`);
    setEnemyTeam(newEnemyTeam);

    setTimeout(() => {
      // Check if enemy still alive
      if (newEnemyTeam[enemyIdx].hp <= 0) {
        // Next enemy or win stage
        if (enemyIdx < enemyTeam.length - 1 && newEnemyTeam.some(e => e.hp > 0)) {
          setEnemyIdx(enemyIdx + 1);
          setArenaMsg(`${enemy.name} fainted! Next enemy steps up.`);
        } else {
          // Player wins this stage
          if (stage < 2) {
            setArenaMsg(`You won battle ${stage + 1}! Prepare for next battle.`);
            setTimeout(() => {
              setStage(stage + 1);
              setEnemyTeam(getArenaBattleAnimals(stage + 1));
              setEnemyIdx(0);
              setPlayerTeam(game.team.map(a => ({ ...a, hp: a.maxhp }))); // Heal for next battle
              setArenaMsg(`Battle ${stage + 2} begins!`);
            }, 1600);
          } else {
            // Final win: get medal and unlock
            setArenaOver(true);
            setArenaMsg(`🏅 You win the ${arena.medalTitle}!`);
            if (onMedalEarned) {
              onMedalEarned(arena.medalTitle, (unlockedAreas) => {
                setPendingUnlock(unlockedAreas);
              });
            }
          }
          return;
        }
      } else {
        // Enemy's turn
        handleEnemyAttack(newEnemyTeam);
      }
    }, 1000);
  }

  function handleEnemyAttack(newEnemyTeam) {
    // Enemy attacks player
    setTimeout(() => {
      const defender = playerTeam[playerIdx];
      if (defender.hp <= 0) {
        // Auto switch if the player's animal fainted
        const nextIdx = playerTeam.findIndex((a, i) => a.hp > 0 && i !== playerIdx);
        if (nextIdx === -1) {
          // All player animals fainted
          setArenaMsg("All your animals have fainted! You lost the challenge.");
          setArenaOver(true);
          return;
        }
        setPlayerIdx(nextIdx);
        setArenaMsg(`${defender.name} fainted! Switched to ${playerTeam[nextIdx].name}.`);
        return;
      }
      const dmg = attack(newEnemyTeam[enemyIdx], defender);
      const newPlayerTeam = playerTeam.slice();
      newPlayerTeam[playerIdx] = { ...defender, hp: Math.max(0, defender.hp - dmg) };
      setPlayerTeam(newPlayerTeam);

      if (newPlayerTeam[playerIdx].hp <= 0) {
        // Auto switch if possible
        const nextIdx = newPlayerTeam.findIndex((a, i) => a.hp > 0 && i !== playerIdx);
        if (nextIdx !== -1) {
          setPlayerIdx(nextIdx);
          setArenaMsg(`${defender.name} fainted! Switched to ${newPlayerTeam[nextIdx].name}.`);
        } else {
          setArenaMsg("All your animals have fainted! You lost the challenge.");
          setArenaOver(true);
        }
      } else {
        setArenaMsg(`Enemy ${newEnemyTeam[enemyIdx].name} attacked! ${defender.name} took ${dmg} damage.`);
      }
    }, 900);
  }

  function handleSwitch(idx) {
    if (arenaOver) return;
    if (playerTeam[idx].hp > 0 && idx !== playerIdx) {
      setPlayerIdx(idx);
      setArenaMsg(`Switched to ${playerTeam[idx].name}`);
    }
  }

  function handleRestart() {
    setStage(0);
    setEnemyTeam(getArenaBattleAnimals(0));
    setEnemyIdx(0);
    setPlayerTeam(game.team.map(a => ({ ...a, hp: a.hp ?? a.maxhp })));
    setArenaMsg(`Welcome to the ${arena.name}!`);
    setArenaOver(false);
    setPendingUnlock(null);
  }

  return (
    <div style={{
      background: 'rgba(0,0,0,0.65)',
      borderRadius: 12,
      padding: 18,
      margin: '18px 0',
      border: '2px solid gold',
      maxWidth: 430,
      boxShadow: '0 6px 32px #0008'
    }}>
      <h3 style={{marginTop:0}}>{arena.name}</h3>
      <div><b>Arena Medal:</b> {arena.medal} {arena.medalTitle}</div>
      <div style={{margin:'8px 0'}}>{arena.description}</div>
      <div style={{margin:'8px 0',fontWeight:'bold'}}>Battle {stage+1} of 3</div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', justifyContent: 'center' }}>
        {/* Player team */}
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Your Team</div>
          {playerTeam.map((a, i) => (
            <div key={i}
              style={{
                background: i === playerIdx ? '#223c1d' : '#2c2c2c',
                color: i === playerIdx ? '#ffd700' : '#fff',
                borderRadius: 8,
                padding: 6,
                margin: '4px 0',
                opacity: a.hp > 0 ? 1 : 0.45,
                border: i === playerIdx ? '2px solid #ffd700' : '1px solid #555',
                fontWeight: i === playerIdx ? 'bold' : 'normal'
              }}>
              <img src={a.sprite} alt={a.name} width={32} style={{verticalAlign:'middle'}} />
              {a.name} Lv.{a.level} HP: {a.hp}/{a.maxhp}
              {a.hp > 0 && i !== playerIdx && (
                <button
                  className="poke-button"
                  style={{ fontSize: 11, marginLeft: 8 }}
                  onClick={() => handleSwitch(i)}
                >Switch</button>
              )}
            </div>
          ))}
        </div>
        {/* Enemy team */}
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Enemy Team</div>
          {enemyTeam.map((a, i) => (
            <div key={i}
              style={{
                background: i === enemyIdx ? '#3d221d' : '#2c2c2c',
                color: i === enemyIdx ? '#ffd700' : '#fff',
                borderRadius: 8,
                padding: 6,
                margin: '4px 0',
                opacity: a.hp > 0 ? 1 : 0.45,
                border: i === enemyIdx ? '2px solid #ffd700' : '1px solid #555',
                fontWeight: i === enemyIdx ? 'bold' : 'normal'
              }}>
              <img src={a.sprite} alt={a.name} width={32} style={{verticalAlign:'middle'}} />
              {a.name} Lv.{a.level} HP: {a.hp}/{a.maxhp}
            </div>
          ))}
        </div>
      </div>
      <div style={{marginTop:12, color:'#ffd700'}}>{arenaMsg}</div>
      {!arenaOver && playerAlive && enemyAlive && (
        <button className="poke-button" style={{marginTop:14, fontWeight:'bold'}} onClick={handlePlayerAttack}>Attack</button>
      )}
      {arenaOver && (
        <button className="poke-button" style={{marginTop:14}} onClick={handleRestart}>Restart Arena</button>
      )}
      {pendingUnlock && (
        <div style={{marginTop:10, color:"#2fd80a", fontWeight:"bold"}}>
          New Areas Unlocked: {pendingUnlock.join(", ")}
        </div>
      )}
    </div>
  );
}
