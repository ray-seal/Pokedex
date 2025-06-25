import { useState, useEffect } from 'react';
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
    if (next) {
      return {
        ...next,
        level: mon.level,
        xp: mon.xp,
        hp: getPokemonStats(next).hp
      };
    }
  }
  if (mon.stage === 2 && mon.level >= 30 && mon.evolves_to) {
    const next = pokedex.find(p => p.id === mon.evolves_to);
    if (next) {
      return {
        ...next,
        level: mon.level,
        xp: mon.xp,
        hp: getPokemonStats(next).hp
      };
    }
  }
  return mon;
}
function getStageMultiplier(mon) {
  if (mon.legendary) return 1.7;
  if (mon.stage === 3) return 1.4;
  if (mon.stage === 2) return 1.2;
  return 1.0;
}
function getWildXP(wild) {
  if (wild.legendary) return 5;
  if (wild.stage === 3) return 4;
  if (wild.stage === 2) return 3;
  return 2;
}

export default function Home() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [wildPokemon, setWildPokemon] = useState(null);
  const [wildHP, setWildHP] = useState(null);
  const [wildMaxHP, setWildMaxHP] = useState(null);
  const [wildLevel, setWildLevel] = useState(null);
  const [message, setMessage] = useState('');
  const [catching, setCatching] = useState(false);
  const [turn, setTurn] = useState('player'); // 'player' or 'wild'
  const [battleOver, setBattleOver] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || !saved.team || saved.team.length === 0) {
      router.push('/team');
      return;
    }
    // Ensure all team Pokémon have level/xp/hp
    const newTeam = saved.team.map(mon => ({
      ...mon,
      level: mon.level || getStartingLevel(mon),
      xp: mon.xp || 0,
      hp: typeof mon.hp === "number" ? mon.hp : getPokemonStats(mon).hp
    }));
    setTeam(newTeam);
    setGame({ ...saved, team: newTeam });
    setActiveIdx(0);
  }, []);

  function getMaxHP(mon) {
    return getPokemonStats(mon).hp;
  }

  function availableBallsForWild(wild, inventory) {
    if (!wild || !inventory) return [];
    const balls = [];
    if (inventory.pokeballs > 0 && !wild.legendary && (wild.stage || 1) <= 1) balls.push('pokeball');
    if (inventory.greatballs > 0 && !wild.legendary && (wild.stage || 1) <= 2) balls.push('greatball');
    if (inventory.ultraballs > 0 && !wild.legendary) balls.push('ultraball');
    if (inventory.masterballs > 0 && wild.legendary) balls.push('masterball');
    return balls;
  }

  function grantBattleXP(idx, xpAmount) {
    const updatedTeam = [...team];
    let mon = updatedTeam[idx];
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
    // Try evolution
    let evolvedMon = tryEvolve(mon);
    evolvedMon.hp = Math.max(evolvedMon.hp || 0, mon.hp || 0);
    updatedTeam[idx] = evolvedMon;
    setTeam(updatedTeam);
    setGame(prev => ({ ...prev, team: updatedTeam }));
    localStorage.setItem('gameState', JSON.stringify({ ...game, team: updatedTeam }));
  }

  // Start a new wild encounter
  function searchLongGrass() {
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    let level = 5;
    if (wild.legendary) level = 50;
    else if (wild.stage === 3) level = 30;
    else if (wild.stage === 2) level = 15;
    const baseStats = getPokemonStats(wild);
    setWildPokemon(wild);
    setWildHP(baseStats.hp);
    setWildMaxHP(baseStats.hp);
    setWildLevel(level);
    setTurn('player');
    setBattleOver(false);
    setMessage(`A wild ${wild.name} appeared in the long grass!`);
  }

  // Player attacks wild Pokémon
  function playerAttack() {
    if (!wildPokemon || wildHP === null || battleOver) return;
    const attacker = team[activeIdx];
    if (attacker.hp <= 0) {
      setMessage("This Pokémon has fainted! Switch to another.");
      return;
    }
    const base = Math.floor(Math.random() * 11) + 15;
    const multiplier = getStageMultiplier(attacker) * (attacker.level / 10);
    const damage = Math.max(1, Math.round(base * multiplier));
    const newWildHP = Math.max(wildHP - damage, 0);
    setWildHP(newWildHP);

    if (newWildHP === 0) {
      const xpGained = getWildXP(wildPokemon);
      setMessage(`Your ${attacker.name} attacked and defeated ${wildPokemon.name}!`);
      grantBattleXP(activeIdx, xpGained);
      setBattleOver(true);
      setTurn('player');
      setTimeout(() => {
        setWildPokemon(null);
        setWildHP(null);
        setWildLevel(null);
        setMessage(`${attacker.name} gained ${xpGained} XP!`);
      }, 1200);
    } else {
      setMessage(`Your ${attacker.name} attacked! ${wildPokemon.name} lost ${damage} HP.`);
      setTurn('wild');
      setTimeout(() => wildAttack(), 1200);
    }
  }

  // Wild attacks player
  function wildAttack() {
    if (!wildPokemon || battleOver) {
      setTurn('player');
      return;
    }
    const wild = wildPokemon;
    const defender = team[activeIdx];
    const base = Math.floor(Math.random() * 11) + 15;
    const multiplier = getStageMultiplier(wild) * (wildLevel / 10);
    const damage = Math.max(1, Math.round(base * multiplier));
    const newHP = Math.max(defender.hp - damage, 0);
    const newTeam = [...team];
    newTeam[activeIdx] = { ...defender, hp: newHP };
    setTeam(newTeam);
    setGame(prev => ({ ...prev, team: newTeam }));

    if (newHP === 0) {
      setMessage(`Wild ${wild.name} attacked! Your ${defender.name} fainted!`);
      if (newTeam.some(mon => mon.hp > 0)) {
        setTurn('player');
      } else {
        setBattleOver(true);
        setTurn('player');
        setMessage(`All your Pokémon have fainted!`);
        setTimeout(() => {
          setWildPokemon(null);
          setWildHP(null);
          setWildLevel(null);
        }, 1500);
      }
    } else {
      setMessage(`Wild ${wild.name} attacked! Your ${defender.name} lost ${damage} HP.`);
      setTurn('player');
    }
  }

  // Switch active Pokémon
  function handleSwitch(idx) {
    if (battleOver || idx === activeIdx || team[idx].hp <= 0 || turn !== 'player') return;
    setActiveIdx(idx);
    setMessage(`You switched to ${team[idx].name}!`);
    setTurn('wild');
    setTimeout(() => wildAttack(), 1200);
  }

  // Catch wild Pokémon logic
  function catchWild(ball) {
    if (!game || !wildPokemon || battleOver || catching) return;
    setCatching(true);
    setTimeout(() => {
      const updated = { ...game };
      updated[ball + 's'] = Math.max((updated[ball + 's'] || 0) - 1, 0);

      const fail = Math.random() < 0.05;
      if (fail) {
        setGame(updated);
        localStorage.setItem('gameState', JSON.stringify(updated));
        setMessage(
          `Oh no! The ${ball.replace('pokeball', 'Poké Ball').replace('greatball','Great Ball').replace('ultraball','Ultra Ball').replace('masterball','Master Ball')} missed!`
        );
        setCatching(false);
        setTurn('wild');
        setTimeout(() => wildAttack(), 1200);
        return;
      }

      if (!updated.pokedex.includes(wildPokemon.id)) {
        updated.pokedex = [...updated.pokedex, wildPokemon.id];
        setMessage(
          `You caught ${wildPokemon.name} with a ${ball.replace('pokeball', 'Poké Ball').replace('greatball','Great Ball').replace('ultraball','Ultra Ball').replace('masterball','Master Ball')}!`
        );
      } else {
        if (!updated.duplicates) updated.duplicates = {};
        updated.duplicates[wildPokemon.id] = (updated.duplicates[wildPokemon.id] || 0) + 1;
        setMessage(
          `You caught another ${wildPokemon.name}! It's a duplicate and can be sold in the Lab for 25 coins.`
        );
      }
      if (!updated.inventory) updated.inventory = {};
      updated.inventory[wildPokemon.id] = (updated.inventory[wildPokemon.id] || 0) + 1;

      setGame(updated);
      localStorage.setItem('gameState', JSON.stringify(updated));
      setCatching(false);
      setBattleOver(true);
      setTimeout(() => {
        setWildPokemon(null);
        setWildHP(null);
        setWildLevel(null);
        setBattleOver(false);
      }, 1200);
    }, 750);
  }

  if (!game) return <p>Loading...</p>;

  return (
    <main
      style={{
        fontFamily: 'monospace',
        minHeight: '100vh',
        background: 'url("/main-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        color: 'white',
        padding: 0,
        margin: 0,
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{marginTop: 32}}>Pokémon Adventure</h1>
      <h2>Your Team</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {team.map((mon, idx) => (
          <div key={mon.id}
            style={{
              border: idx === activeIdx ? '2px solid gold' : '2px solid #fff',
              borderRadius: 12,
              background: mon.hp > 0 ? 'rgba(255,255,255,0.12)' : 'rgba(200,50,50,0.17)',
              padding: 12,
              minWidth: 95,
              textAlign: 'center',
              opacity: mon.hp > 0 ? 1 : 0.5,
              position: 'relative'
            }}>
            <img src={mon.sprite} alt={mon.name} width="48" /><br />
            <strong>{mon.name}</strong><br />
            Level: {mon.level}<br />
            XP: {mon.xp} / {xpForNextLevel(mon.level)}<br />
            HP: {mon.hp} / {getMaxHP(mon)}
            <br />
            <button
              disabled={battleOver || idx === activeIdx || mon.hp <= 0 || turn !== 'player'}
              className="poke-button"
              style={{ fontSize: 12, marginTop: 4, opacity: (idx === activeIdx || mon.hp <= 0) ? 0.5 : 1 }}
              onClick={() => handleSwitch(idx)}
            >{idx === activeIdx ? 'Active' : 'Switch'}
            </button>
          </div>
        ))}
      </div>

      <button className="poke-button" onClick={searchLongGrass} style={{margin: '12px 0 18px 0', fontWeight: 'bold', fontSize: '1.08rem'}}>
        🌾 Search Long Grass
      </button>

      {wildPokemon && (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18, textAlign: 'center', minWidth: 120 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={wildPokemon.sprite} alt={wildPokemon.name} width="96" style={{ display: 'block' }} />
            {game.pokedex && game.pokedex.includes(wildPokemon.id) && (
              <img
                src="/pokeball.png"
                alt="Caught"
                width="32"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              />
            )}
          </div>
          <br />
          <b>{wildPokemon.name}</b>
          <div style={{marginTop: 8, fontWeight: 'bold'}}>
            HP: {wildHP} / {wildMaxHP} <span style={{marginLeft:8}}>Lv.{wildLevel}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            {turn === "player" && !battleOver && (
              <button
                className="poke-button"
                style={{margin: '8px 12px 0 0'}}
                disabled={team[activeIdx].hp <= 0}
                onClick={playerAttack}
              >
                Attack
              </button>
            )}
            {turn === "player" && !battleOver && availableBallsForWild(wildPokemon, game).length > 0 && (
              <span>
                {availableBallsForWild(wildPokemon, game).map((ball) => (
                  <button
                    key={ball}
                    className="poke-button"
                    style={{margin: '8px 12px 0 0'}}
                    disabled={catching}
                    onClick={() => catchWild(ball)}
                  >
                    {ball === 'pokeball' && 'Poké Ball'}
                    {ball === 'greatball' && 'Great Ball'}
                    {ball === 'ultraball' && 'Ultra Ball'}
                    {ball === 'masterball' && 'Master Ball'}
                    {` (${game[ball + 's'] || 0})`}
                  </button>
                ))}
              </span>
            )}
          </div>
        </div>
      )}

      <p style={{minHeight: 32}}>{message}</p>

      <div style={{
        position: 'fixed',
        bottom: 24,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
        zIndex: 100
      }}>
        <button className="poke-button" onClick={() => router.push('/store')}>🛒 Pokemart</button>
        <button className="poke-button" onClick={() => router.push('/lab')}>🧑‍🔬 Professor Oak's Lab</button>
        <button className="poke-button" onClick={() => router.push('/center')}>🏥 Pokémon Center</button>
        <button className="poke-button" onClick={() => router.push('/arena')}>🏟️ Pokémon Arena</button>
        <button className="poke-button" onClick={() => router.push('/pokedex')}>📖 Pokédex</button>
        <button className="poke-button" onClick={() => router.push('/team')}>🧑‍🤝‍🧑 Choose Team</button>
        <button className="poke-button" onClick={() => router.push('/bag')}>🎒 Bag</button>
      </div>

      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 10px 18px;
          border-radius: 7px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.09);
          margin: 6px 0;
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
    </main>
  );
}
