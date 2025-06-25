import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import Link from 'next/link';
import { getPokemonStats } from '../lib/pokemonStats';

export default function TeamBuilder() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const router = useRouter();

  // Upgrade team members to full objects with correct HP on load, preserving XP/level
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      alert("No save found. Returning to home.");
      router.push('/');
      return;
    }
    let upgradedTeam = [];
    if (saved.team) {
      upgradedTeam = saved.team.map(member => {
        // Support both id-only and full-object storage
        const mon = pokedex.find(p => p.id === (member.id || member));
        const stats = getPokemonStats(mon);

        // For id-only, set defaults; for object, preserve xp/level/hp if present
        if (typeof member === "object") {
          return {
            ...mon,
            ...member,
            hp: member.hp !== undefined ? member.hp : stats.hp,
            xp: member.xp !== undefined ? member.xp : 0,
            level: member.level !== undefined ? member.level : 1,
          };
        } else {
          // id-only legacy team save
          return { ...mon, hp: stats.hp, xp: 0, level: 1 };
        }
      });
    }
    setGame(saved);
    setTeam(upgradedTeam.slice(0, 6));
  }, []);

  // Preserve XP/level/hp on select/deselect
  const handleSelect = (id) => {
    const selectedIdx = team.findIndex(p => p.id === id);
    if (selectedIdx !== -1) {
      setTeam(prev => prev.filter(p => p.id !== id));
    } else if (team.length < 6) {
      // Check if this mon was ever in saved.team before for xp/level
      let mon = pokedex.find(p => p.id === id);
      let stats = getPokemonStats(mon);

      // Try to recover previous xp/level/hp from game.team or game.allMons if you store that
      let prevMember = null;
      if (game.team) prevMember = game.team.find(m => (m.id || m) === id);
      if (!prevMember && game.allMons) prevMember = game.allMons.find(m => (m.id || m) === id);

      setTeam(prev => [
        ...prev,
        {
          ...mon,
          xp: prevMember && prevMember.xp !== undefined ? prevMember.xp : 0,
          level: prevMember && prevMember.level !== undefined ? prevMember.level : 1,
          hp: prevMember && prevMember.hp !== undefined ? prevMember.hp : stats.hp,
        },
      ]);
    } else {
      alert("You can only choose up to 6 Pokémon.");
    }
  };

  const saveTeam = () => {
    const updated = { ...game, team };
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
          return (
            <li key={mon.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleSelect(mon.id)}
                />
                <img src={mon.sprite} alt={mon.name} width="32" /> {mon.name}
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
