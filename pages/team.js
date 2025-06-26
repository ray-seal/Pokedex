import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import wildlifejournal from '../public/wildlifejournal.json';
import Link from 'next/link';
import { getPokemonStats } from '../lib/pokemonStats';

export default function TeamBuilder() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const router = useRouter();

  // Utility: get stats from progressBank or initialize defaults
  function getProgress(animal, progressBank = {}) {
    const prog = progressBank[animal.id] || {};
    let autoLevel = 1;
    if (animal.legendary) autoLevel = 50;
    else if (animal.stage === 3) autoLevel = 30;
    else if (animal.stage === 2) autoLevel = 15;

    return {
      ...animal,
      xp: prog.xp !== undefined ? prog.xp : 0,
      level: prog.level !== undefined ? prog.level : autoLevel,
      hp: prog.hp !== undefined ? prog.hp : getPokemonStats(animal).hp,
    };
  }

  // INIT: load game, team, and progress for all Wildlife
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      alert("No save found. Returning to home.");
      router.push('/');
      return;
    }
    if (!saved.wildlifeProgress) saved.wildlifeProgress = {};
    let upgradedTeam = [];
    if (saved.team) {
      upgradedTeam = saved.team.map(member => {
        const animal = wildlifejournal.find(a => a.id === (member.id || member));
        return getProgress(animal, saved.wildlifeProgress);
      });
    }
    setGame(saved);
    setTeam(upgradedTeam.slice(0, 6));
  }, []);

  // Add/remove Wildlife from team, always preserving progress
  const handleSelect = (id) => {
    if (!game) return;
    let progressBank = { ...game.wildlifeProgress };
    const selectedIdx = team.findIndex(a => a.id === id);

    if (selectedIdx !== -1) {
      // Removing from team: save current stats to progressBank
      const animal = team[selectedIdx];
      progressBank[animal.id] = {
        xp: animal.xp,
        level: animal.level,
        hp: animal.hp,
      };
      setTeam(prev => prev.filter(a => a.id !== id));
      setGame(g => ({ ...g, wildlifeProgress: progressBank }));
    } else if (team.length < 6) {
      // Adding: restore stats from progressBank if available
      const animal = wildlifejournal.find(a => a.id === id);
      const progress = getProgress(animal, game.wildlifeProgress);
      setTeam(prev => [...prev, progress]);
    } else {
      alert("You can only choose up to 6 Wildlife.");
    }
  };

  // Save team and all Wildlife progress when user confirms
  const saveTeam = () => {
    let progressBank = { ...(game.wildlifeProgress || {}) };
    team.forEach(animal => {
      progressBank[animal.id] = {
        xp: animal.xp,
        level: animal.level,
        hp: animal.hp,
      };
    });
    const updated = { ...game, team, wildlifeProgress: progressBank };
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

  // Show all caught Wildlife in Journal order
  const caughtAnimals = wildlifejournal
    .filter(animal => (game.wildlifejournal || game.pokedex || []).includes(animal.id))
    .sort((a, b) => a.id - b.id);

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🧩 Build Your Wildlife Team</h1>
      <p>Select up to 6 Wildlife:</p>
      <ul>
        {caughtAnimals.map(animal => {
          const selected = !!team.find(t => t.id === animal.id);
          // Show XP/Level if on team
          const teamAnimal = team.find(t => t.id === animal.id);
          return (
            <li key={animal.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleSelect(animal.id)}
                />
                <img src={animal.sprite} alt={animal.name} width="32" /> {animal.name}
                {teamAnimal && (
                  <span style={{marginLeft:8, color:'#888', fontSize:13}}>
                    Lv.{teamAnimal.level} | XP: {teamAnimal.xp}
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
