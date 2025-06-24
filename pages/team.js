import { useEffect, useState } from 'react';
import data from '../public/pokedex.json';
import Link from 'next/link';

export default function Team() {
  const [game, setGame] = useState(null);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved || !saved.inventory) return;
    setGame(saved);
    setSelection(saved.team?.map(t => t.id) || []);
  }, []);

  const toggleSelect = (id) => {
    if (selection.includes(id)) {
      setSelection(prev => prev.filter(i => i !== id));
    } else if (selection.length < 6) {
      setSelection(prev => [...prev, id]);
    }
  };

  const saveTeam = () => {
    const newTeam = selection.map(id => ({ id, hp: 100 }));
    const updated = { ...game, team: newTeam, activeIndex: 0 };
    localStorage.setItem("gameState", JSON.stringify(updated));
    setGame(updated);
    alert("✅ Team saved!");
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>👥 Choose Your Team</h1>
      <p>Pick up to 6 Pokémon (click entries):</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.keys(game.inventory).map(key => {
          const id = parseInt(key);
          const mon = data.find(p => p.id === id);
          return (
            <li key={id}
                onClick={() => toggleSelect(id)}
                style={{ cursor: 'pointer', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={selection.includes(id)}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <img src={mon.sprite} width="32" style={{ verticalAlign: 'middle' }} />
              {' '} {mon.name}
            </li>
          );
        })}
      </ul>
      <button disabled={selection.length === 0} onClick={saveTeam}>
        ✅ Save Team
      </button>
      <br /><br />
      <Link href="/">⬅ Back to Home</Link>
    </main>
  );
}
