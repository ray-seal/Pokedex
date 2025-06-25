import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

function xpForNextLevel(level) {
  if (level >= 100) return Infinity;
  return Math.ceil(10 * Math.pow(1.01, level - 5));
}

function getStartingLevel(mon) {
  if (mon.legendary) return 50;
  if (mon.stage === 3) return 30;
  if (mon.stage === 2) return 15;
  return 5;
}

function tryEvolve(mon) {
  // Only evolve if not already at max stage and meets level requirement
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

export default function Home() {
  const [game, setGame] = useState(null);
  const [wildPokemon, setWildPokemon] = useState(null);
  const [message, setMessage] = useState('');
  const [catching, setCatching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || !saved.team || saved.team.length === 0) {
      router.push('/team');
      return;
    }
    // Migrate and ensure all team Pokémon have level/xp
    saved.team = saved.team.map(mon => ({
      ...mon,
      level: mon.level || getStartingLevel(mon),
      xp: mon.xp || 0,
    }));
    setGame(saved);
  }, []);

  function getMaxHP(mon) {
    return getPokemonStats(mon).hp;
  }

  function searchLongGrass() {
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWildPokemon(wild);
    setMessage(`A wild ${wild.name} appeared in the long grass!`);
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

  function grantBattleXP(winnerIdx, xpAmount) {
    const updatedTeam = [...game.team];
    let mon = updatedTeam[winnerIdx];
    if (!mon.level) mon.level = getStartingLevel(mon);
    if (!mon.xp) mon.xp = 0;
    let newXP = mon.xp + xpAmount;
    let newLevel = mon.level;
    let evolved = false;
    while (newLevel < 100 && newXP >= xpForNextLevel(newLevel)) {
      newXP -= xpForNextLevel(newLevel);
      newLevel++;
      evolved = true;
    }
    mon.xp = newXP;
    mon.level = newLevel;
    // Try evolution
    let evolvedMon = tryEvolve(mon);
    // If evolved, preserve HP if current was higher
    evolvedMon.hp = Math.max(evolvedMon.hp || 0, mon.hp || 0);
    updatedTeam[winnerIdx] = evolvedMon;
    return updatedTeam;
  }

  function catchWild(ball) {
    if (!game || !wildPokemon) return;
    setCatching(true);
    setTimeout(() => {
      // Deduct ball
      const updated = { ...game };
      updated[ball + 's'] = Math.max((updated[ball + 's'] || 0) - 1, 0);

      // 5% fail chance
      const fail = Math.random() < 0.05;

      if (fail) {
        setGame(updated);
        localStorage.setItem('gameState', JSON.stringify(updated));
        setMessage(
          `Oh no! The ${ball.replace('pokeball', 'Poké Ball').replace('greatball','Great Ball').replace('ultraball','Ultra Ball').replace('masterball','Master Ball')} missed!`
        );
        setCatching(false);
        return;
      }

      // Duplicates logic
      if (!updated.pokedex.includes(wildPokemon.id)) {
        updated.pokedex = [...updated.pokedex, wildPokemon.id];
        setMessage(
          `You caught ${wildPokemon.name} with a ${ball.replace('pokeball', 'Poké Ball').replace('greatball','Great Ball').replace('ultraball','Ultra Ball').replace('masterball','Master Ball')}!`
        );
      } else {
        // Increment duplicates inventory
        if (!updated.duplicates) updated.duplicates = {};
        updated.duplicates[wildPokemon.id] = (updated.duplicates[wildPokemon.id] || 0) + 1;
        setMessage(
          `You caught another ${wildPokemon.name}! It's a duplicate and can be sold in the Lab for 25 coins.`
        );
      }

      // Add level/xp for caught Pokémon/duplicate
      if (!updated.inventory) updated.inventory = {};
      updated.inventory[wildPokemon.id] = (updated.inventory[wildPokemon.id] || 0) + 1;
      // If you want to add to team, add here:
      // updated.team.push({ ...wildPokemon, level: getStartingLevel(wildPokemon), xp: 0, hp: getPokemonStats(wildPokemon).hp });

      setGame(updated);
      localStorage.setItem('gameState', JSON.stringify(updated));
      setCatching(false);
    }, 750);
  }

  // Winning a wild battle (simulate: first Pokémon wins, you can adjust this logic)
  function winWildBattle() {
    if (!game || !wildPokemon) return;
    const winnerIdx = 0; // Example: first team Pokémon always battles
    const newTeam = grantBattleXP(winnerIdx, 10); // 10 XP per win
    const updated = { ...game, team: newTeam };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage(`Your ${newTeam[winnerIdx].name} won and gained 10 XP!`);
    setWildPokemon(null);
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
        {game.team.map((mon) => (
          <div key={mon.id}
            style={{
              border: '2px solid #fff',
              borderRadius: 12,
              background: mon.hp > 0 ? 'rgba(255,255,255,0.12)' : 'rgba(200,50,50,0.17)',
              padding: 12,
              minWidth: 95,
              textAlign: 'center'
            }}>
            <img src={mon.sprite} alt={mon.name} width="48" /><br />
            <strong>{mon.name}</strong><br />
            Level: {mon.level || getStartingLevel(mon)}<br />
            XP: {mon.xp || 0} / {xpForNextLevel(mon.level || getStartingLevel(mon))}<br />
            HP: {mon.hp} / {getMaxHP(mon)}
          </div>
        ))}
      </div>

      <button className="poke-button" onClick={searchLongGrass} style={{margin: '12px 0 18px 0', fontWeight: 'bold', fontSize: '1.08rem'}}>
        🌾 Search Long Grass
      </button>
      {wildPokemon && (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18, textAlign: 'center' }}>
          <img src={wildPokemon.sprite} alt={wildPokemon.name} width="96" />
          {game.pokedex && game.pokedex.includes(wildPokemon.id) && (
            <img
              src="/pokeball.png"
              alt="Caught"
              width="28"
              style={{
                position: 'absolute',
                left: 60,
                bottom: 10,
                pointerEvents: 'none'
              }}
            />
          )}
          <br />
          <b>{wildPokemon.name}</b>
          <div style={{marginTop: 8}}>
            {availableBallsForWild(wildPokemon, game).length > 0 && (
              <div>
                <span>Try to catch: </span>
                {availableBallsForWild(wildPokemon, game).map((ball) => (
                  <button
                    key={ball}
                    className="poke-button"
                    style={{margin: '0 6px'}}
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
              </div>
            )}
            <button 
              className="poke-button" 
              style={{marginLeft: 12}} 
              onClick={winWildBattle}
            >
              🏆 Defeat Wild Pokémon (Gain XP)
            </button>
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
