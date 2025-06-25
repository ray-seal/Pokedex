import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

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
function getWildXP(wild) {
  if (wild.legendary) return 5;
  if (wild.stage === 3) return 4;
  if (wild.stage === 2) return 3;
  return 2;
}
function getMaxHP(mon) {
  return getPokemonStats(mon).hp;
}
function availableBallsForOpponent(opponent, inventory) {
  const { stage, legendary } = opponent;
  const balls = [];
  if (!legendary) {
    if (stage <= 1 && inventory.pokeballs > 0) balls.push('pokeball');
    if (stage <= 2 && inventory.greatballs > 0) balls.push('greatball');
    if (inventory.ultraballs > 0) balls.push('ultraball');
  }
  if (legendary && inventory.masterballs > 0) balls.push('masterball');
  return balls;
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
  updatedTeam[winnerIdx] = evolvedMon;
  return updatedTeam;
}

export default function Arena() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [opponent, setOpponent] = useState(null);
  const [message, setMessage] = useState('');
  const [battleOver, setBattleOver] = useState(false);
  const [rewardOptions, setRewardOptions] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [canCatch, setCanCatch] = useState(false);
  const [balls, setBalls] = useState([]);
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  const [turn, setTurn] = useState('player');
  const router = useRouter();

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
        hp: member.hp ?? stats.hp
      };
    });
    setGame({ ...saved, team: upgradedTeam });
    setTeam(upgradedTeam);
    setActiveIdx(0);
    spawnWild(upgradedTeam, { ...saved, team: upgradedTeam });
    // eslint-disable-next-line
  }, []);

  function spawnWild(currentTeam = team, currentGame = game) {
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    const wildStats = getPokemonStats(wild);
    setOpponent({ ...wild, hp: wildStats.hp });
    setMessage('');
    setBattleOver(false);
    setRewardOptions(false);
    setRewardClaimed(false);
    setCanCatch(false);
    setBalls([]);
    setTurn('player');
    setTeam(currentTeam);
    setGame(currentGame);
  }

  function handleSwitch(idx) {
    if (battleOver || idx === activeIdx || team[idx].hp <= 0 || turn !== 'player') return;
    setActiveIdx(idx);
    setMessage(`You switched to ${team[idx].name}!`);
    setDisabledSwitch(true);
    setTimeout(() => setDisabledSwitch(false), 600);
    setTurn('opponent');
    setTimeout(() => wildAttack(idx), 900);
  }

  function playerAttack() {
    if (!team.length || !opponent || battleOver || turn !== 'player') return;
    const player = team[activeIdx];
    if (player.hp <= 0) {
      setMessage("That Pokémon has fainted! Switch to another.");
      return;
    }
    const playerMultiplier = getStageMultiplier(player);
    const playerDamage = randomDamage(15, playerMultiplier);

    let newOpponentHP = opponent.hp - playerDamage;
    newOpponentHP = Math.max(newOpponentHP, 0);

    setOpponent({ ...opponent, hp: newOpponentHP });

    if (newOpponentHP === 0) {
      // Grant XP to winner
      const xpGained = getWildXP(opponent);
      const newTeam = grantBattleXP(team, activeIdx, xpGained);
      setTeam(newTeam);
      setGame((prev) => ({ ...prev, team: newTeam }));
      localStorage.setItem('gameState', JSON.stringify({ ...game, team: newTeam }));

      setMessage(`You attacked and defeated the wild ${opponent.name}! Your ${newTeam[activeIdx].name} gained ${xpGained} XP!`);
      setBattleOver(true);
      setRewardOptions(true);
      setRewardClaimed(false);
      const balls = availableBallsForOpponent(opponent, game);
      setBalls(balls);
      setCanCatch(balls.length > 0);
    } else {
      setMessage(`You dealt ${playerDamage}!`);
      setTurn('opponent');
      setTimeout(() => wildAttack(activeIdx), 900);
    }
  }

  function wildAttack(idxForAttack) {
    if (!team.length || !opponent || battleOver) return;
    const idx = idxForAttack ?? activeIdx;
    const player = team[idx];
    if (player.hp <= 0 || opponent.hp <= 0) {
      setTurn('player');
      return;
    }
    const opponentMultiplier = getStageMultiplier(opponent);
    const opponentDamage = randomDamage(15, opponentMultiplier);

    let newPlayerHP = player.hp - opponentDamage;
    newPlayerHP = Math.max(newPlayerHP, 0);
    const newTeam = [...team];
    newTeam[idx] = { ...player, hp: newPlayerHP };
    setTeam(newTeam);

    if (newPlayerHP === 0) {
      const anyAlive = newTeam.some(mon => mon.hp > 0);
      if (anyAlive) {
        setMessage(`Wild ${opponent.name} dealt ${opponentDamage}! Your Pokémon fainted, switch to another.`);
        setTurn('player');
      } else {
        setMessage(`Wild ${opponent.name} dealt ${opponentDamage}! All your Pokémon fainted! You lose the battle.`);
        setBattleOver(true);
        setRewardOptions(false);
        setRewardClaimed(false);
      }
    } else {
      setMessage(`Wild ${opponent.name} dealt ${opponentDamage} damage!`);
      setTurn('player');
    }
  }

  function claimCoins() {
    const updated = { ...game, coins: game.coins + 50 };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setRewardOptions(false);
    setRewardClaimed(true);
    setMessage("You received 50 coins!");
  }

  // 2.5% fail rate for Arena catching
  function tryCatch(ballType) {
    if (!canCatch || !battleOver) return;
    const updated = { ...game };
    const { stage, legendary } = opponent;

    if (ballType === 'pokeball') {
      if (updated.pokeballs < 1) return setMessage("No Pokéballs left!");
      if (stage > 1 || legendary) return setMessage("Too strong for a Pokéball.");
      updated.pokeballs--;
    } else if (ballType === 'greatball') {
      if (updated.greatballs < 1) return setMessage("No Great Balls left!");
      if (stage > 2 || legendary) return setMessage("Too strong for a Great Ball.");
      updated.greatballs--;
    } else if (ballType === 'ultraball') {
      if (updated.ultraballs < 1) return setMessage("No Ultra Balls left!");
      if (legendary) return setMessage("Use a Master Ball for legendary Pokémon.");
      updated.ultraballs--;
    } else if (ballType === 'masterball') {
      if (updated.masterballs < 1) return setMessage("No Master Balls left!");
      if (!legendary) return setMessage("Master Balls are for legendary Pokémon only.");
      updated.masterballs--;
    }

    // 2.5% fail chance
    if (Math.random() < 0.025) {
      setGame(updated);
      localStorage.setItem('gameState', JSON.stringify(updated));
      setRewardOptions(false);
      setRewardClaimed(true);
      setMessage(
        `Oh no! The ${ballType.replace('pokeball', 'Poké Ball').replace('greatball','Great Ball').replace('ultraball','Ultra Ball').replace('masterball','Master Ball')} missed!`
      );
      return;
    }

    // Duplicates logic
    if (!updated.pokedex.includes(opponent.id)) {
      updated.pokedex = [...updated.pokedex, opponent.id];
      setMessage(
        `You caught ${opponent.name}!`
      );
    } else {
      if (!updated.duplicates) updated.duplicates = {};
      updated.duplicates[opponent.id] = (updated.duplicates[opponent.id] || 0) + 1;
      setMessage(
        `You caught another ${opponent.name}! It's a duplicate and can be sold in the Lab for 25 coins.`
      );
    }

    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setRewardOptions(false);
    setRewardClaimed(true);
  }

  function goToCenter() {
    if (!game || !team) return;
    const healedTeam = team.map(mon => ({
      ...mon,
      hp: getMaxHP(mon)
    }));
    const updated = { ...game, team: healedTeam };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    router.push('/center');
  }

  function battleAnother() {
    spawnWild(team, game);
    setMessage("A new wild Pokémon appears!");
    setTurn('player');
    setRewardClaimed(false);
  }

  function runAway() {
    setMessage("You ran away safely! A new wild Pokémon appears...");
    spawnWild(team, game);
    setTurn('player');
    setRewardClaimed(false);
  }

  if (!game || !team.length || !opponent)
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
      <h1>🏟️ Battle Arena</h1>
      <h2>Your Team</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {team.map((mon, idx) => (
          <div key={mon.id}
            style={{
              border: idx === activeIdx ? '2px solid gold' : '1px solid #aaa',
              borderRadius: '8px',
              background: mon.hp > 0 ? 'rgba(255,255,255,0.11)' : 'rgba(200,50,50,0.2)',
              padding: 8,
              minWidth: 90,
              textAlign: 'center'
            }}>
            <img src={mon.sprite} alt={mon.name} width="44" /><br />
            <strong>{mon.name}</strong><br />
            Level: {mon.level} <br />
            XP: {mon.xp} / {xpForNextLevel(mon.level)}<br />
            HP: {mon.hp} / {getMaxHP(mon)}
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

      <h2>Wild Opponent</h2>
      <div style={{ marginBottom: 20, position: 'relative', display: 'inline-block' }}>
        <img src={opponent.sprite} alt={opponent.name} width="64" />
        {game?.pokedex?.includes(opponent.id) && (
          <img
            src="/pokeball.png"
            alt="Caught"
            width="24"
            style={{
              position: 'absolute',
              left: 44,
              bottom: 8,
              pointerEvents: 'none'
            }}
          />
        )}
        <br />
        <b>{opponent.name}</b> (HP: {opponent.hp} / {getMaxHP(opponent)})
      </div>

      {!battleOver && turn === 'player' && (
        <div>
          <button className="poke-button" onClick={playerAttack} disabled={team[activeIdx].hp <= 0}>
            Attack!
          </button>
          <button className="poke-button" onClick={runAway} style={{ marginLeft: 10 }}>
            🏃‍♂️ Run Away
          </button>
        </div>
      )}

      <p>
        {battleOver
          ? null
          : turn === 'player'
          ? "Your turn! Attack, Switch, or Run Away."
          : "Wild Pokémon's turn..."}
      </p>
      <p>{message}</p>

      {battleOver && (rewardOptions || rewardClaimed) && (
        <div>
          {rewardOptions && (
            <>
              <h3>🎉 You Won! Choose your reward:</h3>
              <button className="poke-button" onClick={claimCoins}>💰 50 Coins</button>
              {canCatch &&
                <>
                  <span style={{ margin: "0 10px" }} />
                  <span>or try to catch:</span>
                  {balls.map(ball => (
                    <button
                      key={ball}
                      className="poke-button"
                      onClick={() => tryCatch(ball)}
                      style={{ marginLeft: '10px' }}
                    >
                      🎯 {ball[0].toUpperCase() + ball.slice(1).replace('ball', ' Ball')}
                    </button>
                  ))}
                </>
              }
            </>
          )}
          <div style={{ marginTop: 18 }}>
            <button className="poke-button" onClick={battleAnother}>
              ⚔️ Battle Another Wild Pokémon
            </button>
          </div>
        </div>
      )}

      <button className="poke-button" onClick={goToCenter} style={{ marginTop: '22px' }}>
        🏥 Go to Pokémon Center (Heal & Visit)
      </button>
    </main>
  );
}
