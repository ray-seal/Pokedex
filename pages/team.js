// /pages/team.js (simplified)
import { useEffect, useState } from 'react';
import data from '../public/pokedex.json';
import Link from 'next/link';

export default function Team() {
  const [game, setGame] = useState(null);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    setGame(saved);
    setSelection(saved?.team?.map(t => t.id) || []);
  }, []);

  const toggleSelect = (id) => {
    if (selection.includes(id)) {
      setSelection(selection.filter(p => p !== id));
    } else if (selection.length < 6) {
      setSelection([...selection, id]);
    }
  };

  const saveTeam = () => {
    const newTeam = selection.map(id => ({ id, hp: 100 }));
    const updated = { ...game, team: newTeam, activeIndex: 0 };
    localStorage.setItem("gameState", JSON.stringify(updated));
    setGame(updated);
    alert("Team saved!");
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>👥 Choose Your Team</h1>
      <p>Pick up to 6 Pokémon:</p>
      <ul>
        {Object.keys(game.inventory).map(id => {
          const mon = data.find(p => p.id == id);
          return (
            <li key={id} onClick={() => toggleSelect(id)}>
              <input type="checkbox" checked={selection.includes(Number(id))} readOnly />
              <img src={mon.sprite} width="32" /> {mon.name}
            </li>
          );
        })}
      </ul>
      <button disabled={selection.length === 0} onClick={saveTeam}>💾 Save Team</button>
      <br />
      <Link href="/">⬅ Back to Home</Link>
    </main>
  );
}
