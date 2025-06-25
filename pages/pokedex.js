import { useEffect, useState } from 'react';
import data from '../public/pokedex.json';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Pokedex() {
  const [game, setGame] = useState(null);
  const router = useRouter();

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
      {/* Home Button */}
      <button
        className="poke-button"
        style={{ marginBottom: 18 }}
        onClick={() => router.push('/')}
      >
        🏠 Back to Main Page
      </button>

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
    </div>
  );
}
