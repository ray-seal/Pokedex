import { useEffect, useState } from 'react';
import Link from 'next/link';
import data from '../public/pokedex.json';

export default function Center() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved && saved.team) {
      const healedTeam = saved.team.map(p => ({ ...p, hp: 100 }));
      const updated = { ...saved, team: healedTeam };
      setGame(updated);
      localStorage.setItem("gameState", JSON.stringify(updated));
    }
  }, []);

  if (!game) return <p>Healing in progress...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>🏥 Pokémon Center</h1>
      <p>Your team has been fully healed.</p>

      <h2>❤️ Team Status</h2>
      <ul>
        {game.team.map((p, i) => {
          const mon = data.find(m => m.id === p.id);
          return <li key={i}>{mon.name} — HP: {p.hp}</li>;
        })}
      </ul>

      <br />
      <Link href="/">⬅ Back to Home</Link>
    </main>
  );
}
