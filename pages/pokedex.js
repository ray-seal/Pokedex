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

  // Calculate caught count
  const caughtCount = game.pokedex.length;
  const totalCount = 151;

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      {/* Caught Counter Box */}
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '18px',
        color: '#222',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: '1.2rem'
      }}>
        You’ve caught {caughtCount} out of {totalCount} Pokémon!
      </div>
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
