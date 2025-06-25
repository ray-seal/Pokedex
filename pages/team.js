import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import Link from 'next/link';
import { getPokemonStats } from '../lib/pokemonStats';

export default function TeamBuilder() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const router = useRouter();

  // Utility: get stats from progressBank or initialize defaults
  function getProgress(mon, progressBank = {}) {
    const prog = progressBank[mon.id] || {};
    let autoLevel = 1;
    if (mon.legendary) autoLevel = 50;
    else if (mon.stage === 3) autoLevel = 30;
    else if (mon.stage === 2) autoLevel = 15;

    return {
      ...mon,
      xp: prog.xp !== undefined ? prog.xp : 0,
      level: prog.level !== undefined ? prog.level : autoLevel,
      hp: prog.hp !== undefined ? prog.hp : getPokemonStats(mon).hp,
    };
  }

  // INIT: load game, team, and progress for all Pokémon
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      alert("No save found. Returning to home.");
      router.push('/');
      return;
    }
    if (!saved.pokemonProgress) saved.pokemonProgress = {};
    let upgradedTeam = [];
    if (saved.team) {
      upgradedTeam = saved.team.map(member => {
        const mon = pokedex.find(p => p.id === (member.id || member));
        return getProgress(mon, saved.pokemonProgress);
      });
    }
    setGame(saved);
    setTeam(upgradedTeam.slice(0, 6));
  }, []);

  // Add/remove Pokémon from team, always preserving progress
  const handleSelect = (id) => {
    if (!game) return;
    let progressBank = { ...game.pokemonProgress };
    const selectedIdx = team.findIndex(p => p.id === id);

    if (selectedIdx !== -1) {
      // Removing from team: save current stats to progressBank
      const mon = team[selectedIdx];
      progressBank[mon.id] = {
        xp: mon.xp,
        level: mon.level,
        hp: mon.hp,
      };
      setTeam(prev => prev.filter(p => p.id !== id));
      setGame(g => ({ ...g, pokemonProgress: progressBank }));
    } else if (team.length < 6) {
      // Adding: restore stats from progressBank if available
      const mon = pokedex.find(p => p.id === id);
      const progress = getProgress(mon, game.pokemonProgress);
      setTeam(prev => [...prev, progress]);
    } else {
      alert("You can only choose up to 6 Pokémon.");
    }
  };

  // Save team and all Pokémon progress when user confirms
  const saveTeam = () => {
    let progressBank = { ...(game.pokemonProgress || {}) };
    team.forEach(mon => {
      progressBank[mon.id] = {
        xp: mon.xp,
        level: mon.level,
        hp: mon.hp,
      };
    });
    const updated = { ...game, team, pokemonProgress: progressBank };
    localStorage.setItem("gameState", JSON.stringify(updated));
    router.push('/arena');
  };

  const resetTeam = () => {
    setTeam([]);
    if (game) {
      const updated = { ...game, team: [] };
      localStorage.setItem("gameState", JSON.stringify(updated));
    }
  };

  if (!game) return <p>Loading team builder...</p>;

  // Show all caught Pokémon in Pokédex order
  const caughtMons = pokedex
    .filter(mon => game.pokedex.includes(mon.id))
    .sort((a, b) => a.id - b.id);

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🧩 Build Your Team</h1>
      <p>Select up to 6 Pokémon:</p>
      <ul>
        {caughtMons.map(mon => {
          const selected = !!team.find(t => t.id === mon.id);
          // Show XP/Level if on team
          const teamMon = team.find(t => t.id === mon.id);
          return (
            <li key={mon.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleSelect(mon.id)}
                />
                <img src={mon.sprite} alt={mon.name} width="32" /> {mon.name}
                {teamMon && (
                  <span style={{marginLeft:8, color:'#888', fontSize:13}}>
                    Lv.{teamMon.level} | XP: {teamMon.xp}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
      <button onClick={resetTeam} style={{ marginRight: '10px' }}>🗑️ Reset Team</button>
      <button onClick={saveTeam}>✅ Save Team and Go to Arena</button>
      <Link href="/">
        <a className="poke-button" style={{ marginTop: '15px', display: 'inline-block' }}>🏠 Back to Home Page</a>
      </Link>
      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 10px 20px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          margin: 6px 8px 6px 0;
          cursor: pointer;
          color: #222;
          text-decoration: none;
          font-family: inherit;
          font-size: 1rem;
          display: inline-block;
          transition: background 0.2s, border 0.2s;
        }
        .poke-button:hover {
          background: #e0e0e0;
          border-color: #888;
        }
      `}</style>
    </main>
  );
}
