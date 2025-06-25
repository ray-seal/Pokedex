import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Bag() {
  const [game, setGame] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      router.push('/');
      return;
    }
    setGame(saved);
  }, []);

  if (!game) return <p>Loading your bag...</p>;

  const items = [
    { key: 'pokeballs', name: 'Poké Ball', emoji: '🔴' },
    { key: 'greatballs', name: 'Great Ball', emoji: '🔵' },
    { key: 'ultraballs', name: 'Ultra Ball', emoji: '🟡' },
    { key: 'masterballs', name: 'Master Ball', emoji: '🟣' },
    { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪' },
    { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🧴' },
    { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧' },
  ];

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
      <h1 style={{ marginTop: 32 }}>🎒 Bag</h1>
      <div
        style={{
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 16,
          padding: 32,
          minWidth: 260,
          marginTop: 24,
        }}
      >
        <h2 style={{ marginBottom: 18 }}>Your Items</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item =>
            game[item.key] > 0 ? (
              <li key={item.key} style={{ fontSize: 18, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span> {item.name}: <b>{game[item.key]}</b>
              </li>
            ) : null
          )}
        </ul>
        {items.every(item => !game[item.key]) && <p>(Your bag is empty!)</p>}
      </div>
      <button
        className="poke-button"
        onClick={() => router.push('/')}
        style={{ marginTop: 32 }}
      >
        ← Back to Adventure
      </button>
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
