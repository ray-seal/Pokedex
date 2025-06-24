import { useEffect, useState } from 'react';
import data from '../public/pokedex.json';
import Link from 'next/link';

export default function Pokedex() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved) setGame(saved);
  }, []);

  if (!game) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>📖 Pokédex</h1>
      <ul>
        {data.map(p => {
          const caught = game.pokedex.includes(p.id);
          return (
            <li key={p.id}>
              {caught ? (
                <>
                  <img src={p.sprite} alt={p.name} width="32" /> {p.name}
                </>
              ) : (
                <>
                  <img src="/unknown.png" alt="Unknown" width="32" /> ???
                </>
              )}
            </li>
          );
        })}
      </ul>
      <Link href="/">🏠 Back to Main Page</Link>
    </div>
  );
}
