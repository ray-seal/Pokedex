import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGame } from '../context/GameContext';

const ITEMS = [
  { key: 'pokeballs', name: 'Small Net', emoji: '🕸️', type: 'ball' },
  { key: 'greatballs', name: 'Medium Net', emoji: '🦑', type: 'ball' },
  { key: 'ultraballs', name: 'Large Net', emoji: '🦈', type: 'ball' },
  { key: 'masterballs', name: 'Large Chains', emoji: '⚓️', type: 'ball' },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', type: 'heal' },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🥤', type: 'heal' },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', type: 'heal' },
  { key: 'fwrod', name: 'Freshwater Rod', emoji: '🎣', type: 'rod' },
  { key: 'swrod', name: 'Saltwater Rod', emoji: '🪝', type: 'rod' },
  { key: 'maggots', name: 'Maggots (Bait)', emoji: '🪱', type: 'bait' },
  { key: 'lugworm', name: 'Lug-worm (Bait)', emoji: '🪱', type: 'bait' },
  { key: 'boot', name: 'Old Boot', emoji: '🥾', type: 'junk' },
  { key: 'lure', name: 'Lost Lure', emoji: '🪝', type: 'junk' },
];

export default function Bag() {
  const { game } = useGame();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);

  if (!game) return <p>Loading your bag...</p>;

  return (
    <main style={{ fontFamily: 'monospace', minHeight: '100vh', background: '#f9f9f9', color: '#222' }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          zIndex: 999,
          fontSize: 20,
          background: '#222',
          color: '#fff',
          border: 'none',
          padding: '8px 0'
        }}>
        {collapsed ? "▼ Show Inventory" : "▲ Hide Inventory"}
      </button>
      {!collapsed && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          marginTop: 40,
          background: '#333',
          color: '#fff',
          borderRadius: 0,
          position: 'fixed',
          top: 40,
          left: 0,
          width: '100vw',
          zIndex: 998,
          maxHeight: '40vh',
          overflowY: 'scroll'
        }}>
          {ITEMS.map(item =>
            game[item.key] > 0 ? (
              <li key={item.key} style={{
                fontSize: 18,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <span>{item.name}:</span>
                <b>{game[item.key]}</b>
              </li>
            ) : null
          )}
        </ul>
      )}

      <div style={{ paddingTop: 70 }}>
        <h1>🎒 Bag</h1>
        {ITEMS.every(item => !game[item.key]) && <p>(Your bag is empty!)</p>}
        <button className="poke-button" onClick={() => router.back()} style={{ marginTop: 32 }}>
          ← Back
        </button>
      </div>
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
        @media (max-width: 600px) {
          button[style*="position: fixed"] {
            position: fixed !important;
            bottom: 0 !important;
            top: auto !important;
            left: 0;
            width: 100vw;
            border-radius: 0;
            box-shadow: 0 -2px 10px #000a;
          }
        }
      `}</style>
    </main>
  );
}
