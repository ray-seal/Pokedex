import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

// Utility to generate random NPC names
const NPC_NAMES = [
  "Trainer Alex", "Trainer Pat", "Rival Max", "Ace Jamie", "Bird Keeper Sam",
  "Lass Chloe", "Youngster Tim", "Bug Catcher Eli", "Hiker Bob", "Cooltrainer Zoe",
  "Sage Lin", "Swimmer Kim", "Biker Vick", "Psychic Ray", "Rich Kid Leo"
];
function getRandomNPCName() {
  return NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- BagModal Component (unchanged except passing npcTeam and npcActiveIdx) ---
function BagModal({ open, onClose, game, turn, npcTeam, npcActiveIdx, team, activeIdx, onUseItem }) {
  if (!open) return null;
  const ITEMS = [
    { key: 'pokeballs', name: 'Poké Ball', emoji: '🔴', type: 'ball' },
    { key: 'greatballs', name: 'Great Ball', emoji: '🔵', type: 'ball' },
    { key: 'ultraballs', name: 'Ultra Ball', emoji: '🟡', type: 'ball' },
    { key: 'masterballs', name: 'Master Ball', emoji: '🟣', type: 'ball' },
    { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', type: 'heal' },
    { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🧴', type: 'heal' },
    { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', type: 'heal' },
  ];
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.70)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#262626', color: 'white', padding: 32, borderRadius: 18, minWidth: 300,
        boxShadow: '0 4px 32px #000a'
      }}>
        <h2 style={{marginTop:0}}>🎒 Bag</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ITEMS.map(item =>
            game[item.key] > 0 && (
              <li key={item.key} style={{ fontSize: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <span>{item.name}</span>
                <b style={{marginLeft:2}}>{game[item.key]}</b>
                {item.type === "heal" && team && team[activeIdx] && turn === "player" && team[activeIdx].hp < team[activeIdx].maxhp &&
                  <button className="poke-button" style={{marginLeft:10, fontSize:13}} onClick={() => onUseItem(item.key)}>
                    Use
                  </button>
                }
                {item.type === "heal" && team && team[activeIdx] && team[activeIdx].hp >= team[activeIdx].maxhp &&
                  <span style={{color:'#aaa',marginLeft:10,fontSize:13}}>(Full HP)</span>
                }
              </li>
            )
          )}
        </ul>
        <button className="poke-button" style={{marginTop:18}} onClick={onClose}>Close</button>
      </div>
      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 8px 14px;
          border-radius: 7px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.09);
          cursor: pointer;
          color: #222;
          text-decoration: none;
          font-family: inherit;
          font-size: 1rem;
          display: inline-block;
          transition: background 0.18s, border 0.18s;
        }
        .poke-button:hover {
          background: #e0e0e0;
          border-color: #888;
        }
      `}</style>
    </div>
  );
}
// --- End BagModal ---

function xpForNextLevel(level) {
  if (level >= 100) return Infinity;
  return Math.ceil(10 * Math.pow(1.2, level - 5));
}
function getStartingLevel(mon) {
  if (mon.legendary) return 50;
  if (mon.stage === 3) return 30;
  if (mon.stage === 2) return 15;
  return 5;
}
function tryEvolve(mon) {
  if (mon.stage === 1 && mon.level >= 15 && mon.evolves_to) {
    const next = pokedex.find(p => p.id === mon.evolves_to);
    if (next) return {
      ...next,
      level: mon.level,
      xp: mon.xp,
      hp: getPokemonStats(next).hp
    };
  }
  if (mon.stage === 2 && mon.level >= 30 && mon.evolves_to) {
    const next = pokedex.find(p => p.id === mon.evolves_to);
    if (next) return {
      ...next,
      level: mon.level,
      xp: mon.xp,
      hp: getPokemonStats(next).hp
    };
  }
  return mon;
}
function getStageMultiplier(mon) {
  if (mon.legendary) return 1.7;
  if (mon.stage === 3) return 1.4;
  if (mon.stage === 2) return 1.2;
  return 1;
}
function randomDamage(base, multiplier) {
  return Math.round((base + Math.floor(Math.random() * 11)) * multiplier);
}
function getMaxHP(mon) {
  return getPokemonStats(mon).hp;
}
function usePotion(team, idx, type) {
  const healedTeam = [...team];
  const mon = healedTeam[idx];
  const maxHP = getMaxHP(mon);
  mon.maxhp = maxHP;
  if (type === 'potions') mon.hp = Math.min(mon.hp + 10, maxHP);
  else if (type === 'superpotions') mon.hp = Math.min(mon.hp + 50, maxHP);
  else if (type === 'fullheals') mon.hp = maxHP;
  return healedTeam;
}
function grantBattleXP(team, winnerIdx, xpAmount) {
  const updatedTeam = [...team];
  let mon = updatedTeam[winnerIdx];
  if (!mon.level) mon.level = getStartingLevel(mon);
  if (!mon.xp) mon.xp = 0;
  let newXP = mon.xp + xpAmount;
  let newLevel = mon.level;
  while (newLevel < 100 && newXP >= xpForNextLevel(newLevel)) {
    newXP -= xpForNextLevel(newLevel);
    newLevel++;
  }
  mon.xp = newXP;
  mon.level = newLevel;
  let evolvedMon = tryEvolve(mon);
  evolvedMon.hp = Math.max(evolvedMon.hp || 0, mon.hp || 0);
  evolvedMon.maxhp = getMaxHP(evolvedMon);
  updatedTeam[winnerIdx] = evolvedMon;
  return updatedTeam;
}

function getRewardForNPCTeamSize(n) {
  if (n === 1) return getRandomInt(100, 110);
  if (n === 2) return getRandomInt(120, 130);
  if (n === 3) return getRandomInt(140, 160);
  if (n === 4) return getRandomInt(170, 190);
  if (n === 5) return getRandomInt(200, 220);
  return getRandomInt(230, 250);
}

export default function Arena() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // NPC state
  const [npcName, setNpcName] = useState('');
  const [npcTeam, setNpcTeam] = useState([]);
  const [npcActiveIdx, setNpcActiveIdx] = useState(0);

  const [message, setMessage] = useState('');
  const [battleOver, setBattleOver] = useState(false);
  const [reward, setReward] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [turn, setTurn] = useState('player');
  const [showBag, setShowBag] = useState(false);
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  const router = useRouter();

  // On mount, load player and generate NPC
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || !saved.team || saved.team.length === 0) {
      alert('No team found. Returning to home.');
      router.push('/');
      return;
    }
    let upgradedTeam = saved.team.map(member => {
      const mon = pokedex.find(p => p.id === member.id);
      const stats = getPokemonStats(mon);
      return {
        ...mon,
        ...member,
        level: member.level || getStartingLevel(mon),
        xp: member.xp || 0,
        hp: member.hp ?? stats.hp,
        maxhp: stats.hp
      };
    });
    setGame({ ...saved, team: upgradedTeam });
    setTeam(upgradedTeam);
    setActiveIdx(0);
    startNpcBattle(upgradedTeam, { ...saved, team: upgradedTeam });
    // eslint-disable-next-line
  }, []);

  // Helper: generate random NPC team
  function randomNpcTeam() {
    const size = getRandomInt(1, 6);
    const ids = [];
    while (ids.length < size) {
      const candidate = pokedex[getRandomInt(0, pokedex.length - 1)];
      if (!ids.includes(candidate.id)) ids.push(candidate.id);
    }
    return ids.map(id => {
      const mon = pokedex.find(p => p.id === id);
      const stats = getPokemonStats(mon);
      // NPC levels: 5–(10+teamSize*5), scale up with team size
      const level = getRandomInt(5 + size * 2, 10 + size * 5);
      return {
        ...mon,
        level,
        xp: 0,
        hp: stats.hp,
        maxhp: stats.hp
      };
    });
  }

  function startNpcBattle(currentTeam, currentGame) {
    const npcName = getRandomNPCName();
    const team = randomNpcTeam();
    setNpcName(npcName);
    setNpcTeam(team);
    setNpcActiveIdx(0);
    setTurn('player');
    setBattleOver(false);
    setReward(getRewardForNPCTeamSize(team.length));
    setRewardClaimed(false);
    setMessage(`${npcName} wants to battle! They have ${team.length} Pokémon.`);
    setShowBag(false);
    setDisabledSwitch(false);
  }

  function handleSwitch(idx) {
    if (battleOver || idx === activeIdx || team[idx].hp <= 0 || turn !== 'player') return;
    setActiveIdx(idx);
    setMessage(`You switched to ${team[idx].name}!`);
    setDisabledSwitch(true);
    setTimeout(() => setDisabledSwitch(false), 600);
    setTurn('npc');
    setTimeout(() => npcAttack(idx), 900);
  }

  function handleUseBagItem(type) {
    // Only healing items in NPC battles
    if (['potions','superpotions','fullheals'].includes(type)) {
      if (team[activeIdx].hp >= team[activeIdx].maxhp) {
        setMessage('HP already full!');
        setShowBag(false);
        return;
      }
      let updatedTeam = usePotion(team, activeIdx, type);
      let updatedGame = { ...game, team: updatedTeam };
      updatedGame[type] = (updatedGame[type] || 1) - 1;
      setTeam(updatedTeam);
      setGame(updatedGame);
      localStorage.setItem('gameState', JSON.stringify(updatedGame));
      setMessage(
        type === 'potions' ? "Potion used! Healed 10 HP." :
        type === 'superpotions' ? "Super Potion used! Healed 50 HP." :
        "Full Heal used! Restored to full HP."
      );
      setTurn('npc');
      setShowBag(false);
      setTimeout(() => npcAttack(activeIdx), 900);
    }
  }

  // Player attacks NPC's current Pokémon
  function playerAttack() {
    if (!team.length || !npcTeam.length || battleOver || turn !== 'player') return;
    const player = team[activeIdx];
    if (player.hp <= 0) {
      setMessage("That Pokémon has fainted! Switch to another.");
      return;
    }
    const npcMon = npcTeam[npcActiveIdx];
    const playerMultiplier = getStageMultiplier(player);
    const playerDamage = randomDamage(15, playerMultiplier);

    let newNpcHP = npcMon.hp - playerDamage;
    newNpcHP = Math.max(newNpcHP, 0);

    const updatedNpcTeam = [...npcTeam];
    updatedNpcTeam[npcActiveIdx] = { ...npcMon, hp: newNpcHP };
    setNpcTeam(updatedNpcTeam);

    if (newNpcHP === 0) {
      // Defeated NPC Pokémon
      if (npcActiveIdx + 1 < npcTeam.length) {
        setMessage(`You defeated ${npcMon.name}! ${npcName} sends out ${npcTeam[npcActiveIdx+1].name}!`);
        setTimeout(() => {
          setNpcActiveIdx(npcActiveIdx + 1);
          setTurn('npc');
          setTimeout(() => npcAttack(activeIdx), 900);
        }, 1200);
      } else {
        // All NPC Pokémon defeated
        const xpGained = 5 * npcTeam.length;
        const newTeam = grantBattleXP(team, activeIdx, xpGained);
        setTeam(newTeam);
        setGame((prev) => ({ ...prev, team: newTeam }));
        localStorage.setItem('gameState', JSON.stringify({ ...game, team: newTeam }));
        setMessage(`You defeated ${npcName}! Your ${newTeam[activeIdx].name} gained ${xpGained} XP!`);
        setBattleOver(true);
        setRewardClaimed(false);
      }
    } else {
      setMessage(`You dealt ${playerDamage} damage!`);
      setTurn('npc');
      setTimeout(() => npcAttack(activeIdx), 900);
    }
  }

  // NPC's turn
  function npcAttack(idxForAttack) {
    if (!team.length || !npcTeam.length || battleOver) return;
    const idx = idxForAttack ?? activeIdx;
    const player = team[idx];
    const npcMon = npcTeam[npcActiveIdx];
    if (player.hp <= 0 || npcMon.hp <= 0) {
      setTurn('player');
      return;
    }
    const npcMultiplier = getStageMultiplier(npcMon);
    const npcDamage = randomDamage(15, npcMultiplier);

    let newPlayerHP = player.hp - npcDamage;
    newPlayerHP = Math.max(newPlayerHP, 0);
    const newTeam = [...team];
    newTeam[idx] = { ...player, hp: newPlayerHP };
    setTeam(newTeam);

    if (newPlayerHP === 0) {
      const anyAlive = newTeam.some(mon => mon.hp > 0);
      if (anyAlive) {
        setMessage(`${npcName}'s ${npcMon.name} dealt ${npcDamage}! Your Pokémon fainted, switch to another.`);
        setTurn('player');
      } else {
        setMessage(`${npcName}'s ${npcMon.name} dealt ${npcDamage}! All your Pokémon fainted! You lose the battle.`);
        setBattleOver(true);
      }
    } else {
      setMessage(`${npcName}'s ${npcMon.name} dealt ${npcDamage} damage!`);
      setTurn('player');
    }
  }

  function claimReward() {
    const updated = { ...game, coins: game.coins + reward };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setRewardClaimed(true);
    setMessage(`You received ${reward} coins!`);
  }

  function goToCenter() {
    if (!game || !team) return;
    const healedTeam = team.map(mon => ({
      ...mon,
      hp: mon.maxhp
    }));
    const updated = { ...game, team: healedTeam };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    router.push('/center');
  }

  function battleAnother() {
    startNpcBattle(team, game);
  }

  if (!game || !team.length || !npcTeam.length)
    return <p>Loading battle...</p>;

  return (
    <main
      style={{
        fontFamily: 'monospace',
        padding: 20,
        background: 'url("/arena-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        color: 'white',
        minHeight: '100vh',
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
      }}
    >
      <BagModal
        open={showBag}
        onClose={() => setShowBag(false)}
        game={game}
        turn={turn}
        npcTeam={npcTeam}
        npcActiveIdx={npcActiveIdx}
        team={team}
        activeIdx={activeIdx}
        onUseItem={handleUseBagItem}
      />
      <h1>🏟️ Battle Arena</h1>
      <h2>Your Team</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {team.map((mon, idx) => (
          <div key={mon.id}
            style={{
              border: idx === activeIdx ? '2px solid gold' : '1px solid #aaa',
              borderRadius: '8px',
              background: mon.hp > 0 ? 'rgba(50,200,50,0.65)' : 'rgba(200,50,50,0.65)',
              padding: 8,
              minWidth: 90,
              textAlign: 'center'
            }}>
            <img src={mon.sprite} alt={mon.name} width="44" /><br />
            <strong>{mon.name}</strong><br />
            Level: {mon.level} <br />
            XP: {mon.xp} / {xpForNextLevel(mon.level)}<br />
            HP: {mon.hp} / {mon.maxhp}
            <br />
            <button
              disabled={battleOver || idx === activeIdx || mon.hp <= 0 || disabledSwitch || turn !== 'player'}
              className="poke-button"
              style={{ fontSize: 12, marginTop: 4, opacity: (idx === activeIdx || mon.hp <= 0) ? 0.5 : 1 }}
              onClick={() => handleSwitch(idx)}
            >{idx === activeIdx ? 'Active' : 'Switch'}
            </button>
          </div>
        ))}
      </div>
      <h2>{npcName}'s Team</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        {npcTeam.map((mon, idx) => (
          <div key={mon.id}
            style={{
              border: idx === npcActiveIdx ? '2px solid gold' : '1px solid #aaa',
              borderRadius: '8px',
              background: mon.hp > 0 ? 'rgba(50,200,50,0.65)' : 'rgba(200,50,50,0.65)',
              padding: 8,
              minWidth: 90,
              textAlign: 'center',
              opacity: mon.hp > 0 ? 1 : 0.5
            }}>
            <img src={mon.sprite} alt={mon.name} width="44" /><br />
            <strong>{mon.name}</strong><br />
            Level: {mon.level} <br />
            HP: {mon.hp} / {mon.maxhp}
            <br />
            {idx === npcActiveIdx && <span style={{ color: "#ffd700", fontWeight: "bold" }}>Active</span>}
          </div>
        ))}
      </div>
      {!battleOver && turn === 'player' && (
        <div>
          <button className="poke-button" onClick={playerAttack} disabled={team[activeIdx].hp <= 0}>
            Attack!
          </button>
          <button className="poke-button" onClick={() => setShowBag(true)} style={{ marginLeft: 10 }}>
            🎒 Bag
          </button>
        </div>
      )}
      <p>
        {battleOver
          ? null
          : turn === 'player'
          ? "Your turn! Attack, Use Bag, or Switch."
          : `${npcName}'s turn...`}
      </p>
      <p>{message}</p>
      {battleOver && (
        <div>
          {!rewardClaimed ? (
            <>
              <h3>🎉 You Won! Claim your reward:</h3>
              <button className="poke-button" onClick={claimReward}>💰 Claim {reward} Coins</button>
            </>
          ) : (
            <h3>🎉 You received {reward} coins!</h3>
          )}
          <div style={{ marginTop: 18 }}>
            <button className="poke-button" onClick={battleAnother}>
              ⚔️ Battle Another NPC Trainer
            </button>
          </div>
        </div>
      )}
      <button className="poke-button" onClick={goToCenter} style={{ marginTop: '22px' }}>
        🏥 Go to Pokémon Center (Heal & Visit)
      </button>
      <button className="poke-button" onClick={() => router.push('/bag')} style={{ marginTop: '12px' }}>
        🎒 View Bag
      </button>
    </main>
  );
}
