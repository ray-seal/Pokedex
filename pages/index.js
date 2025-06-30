import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useRouter } from 'next/router';

const ITEMS = [
  { key: 'pokeballs', name: 'Small Net', emoji: '🕸️', type: 'ball' },
  { key: 'greatballs', name: 'Medium Net', emoji: '🦑', type: 'ball' },
  { key: 'ultraballs', name: 'Large Net', emoji: '🦈', type: 'ball' },
  { key: 'masterballs', name: 'Large Chains', emoji: '⚓️', type: 'ball' },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', type: 'heal' },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🥤', type: 'heal' },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', type: 'heal' },
  { key: 'fwrod', name: 'Freshwater Rod', emoji: '🎣', type: 'rod', rodType: 'freshwater' },
  { key: 'swrod', name: 'Saltwater Rod', emoji: '🪝', type: 'rod', rodType: 'saltwater' },
  { key: 'maggots', name: 'Maggots (Bait)', emoji: '🪱', type: 'bait', baitType: 'freshwater' },
  { key: 'lugworm', name: 'Lug-worm (Bait)', emoji: '🪱', type: 'bait', baitType: 'saltwater' },
  { key: 'boot', name: 'Old Boot', emoji: '🥾', type: 'junk' },
  { key: 'lure', name: 'Lost Lure', emoji: '🪝', type: 'junk' },
];

export default function Home() {
  const { game, setGame } = useGame();
  const [message, setMessage] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  const [wildlifejournal, setWildlifejournal] = useState([]);

  useEffect(() => {
    // Load wildlifejournal from somewhere (API, localStorage, or static import)
    // Here, assume window.wildlifejournal exists or import it
    if (window && window.wildlifejournal) setWildlifejournal(window.wildlifejournal);
    // Or import wildlifejournal from a file if available
  }, []);

  // FISHING LOGIC
  function goFreshwaterFishing() {
    if (!game.maggots || game.maggots < 1) {
      setMessage("You need maggots to fish freshwater! Buy some from the store.");
      return;
    }
    const candidates = wildlifejournal.filter(w => w && w.habitat === 'freshwater');
    const junk = [
      { key: 'boot', name: 'Old Boot', emoji: '🥾' },
      { key: 'lure', name: 'Lost Lure', emoji: '🪝' }
    ];
    // 80% wildlife, 20% junk
    const pool = [
      ...candidates,
      ...(Math.random() < 0.2 ? [junk[Math.floor(Math.random() * junk.length)]] : [])
    ];
    const catchItem = pool[Math.floor(Math.random() * pool.length)];
    let updated = { ...game, maggots: game.maggots - 1 };
    if (!catchItem.id) {
      updated[catchItem.key] = (updated[catchItem.key] || 0) + 1;
      setMessage(`You caught a ${catchItem.name}! Better luck next time.`);
    } else {
      if (!updated.wildlifejournal.includes(catchItem.id)) {
        updated.wildlifejournal = [...updated.wildlifejournal, catchItem.id];
        setMessage(`You caught a ${catchItem.name}!`);
      } else {
        setMessage(`You caught another ${catchItem.name}!`);
      }
    }
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
  }

  function goSaltwaterFishing() {
    if (!game.lugworm || game.lugworm < 1) {
      setMessage("You need lug-worms to fish saltwater! Buy some from the store.");
      return;
    }
    const candidates = wildlifejournal.filter(w => w && w.habitat === 'saltwater');
    const junk = [
      { key: 'boot', name: 'Old Boot', emoji: '🥾' },
      { key: 'lure', name: 'Lost Lure', emoji: '🪝' }
    ];
    const pool = [
      ...candidates,
      ...(Math.random() < 0.2 ? [junk[Math.floor(Math.random() * junk.length)]] : [])
    ];
    const catchItem = pool[Math.floor(Math.random() * pool.length)];
    let updated = { ...game, lugworm: game.lugworm - 1 };
    if (!catchItem.id) {
      updated[catchItem.key] = (updated[catchItem.key] || 0) + 1;
      setMessage(`You caught a ${catchItem.name}! Better luck next time.`);
    } else {
      if (!updated.wildlifejournal.includes(catchItem.id)) {
        updated.wildlifejournal = [...updated.wildlifejournal, catchItem.id];
        setMessage(`You caught a ${catchItem.name}!`);
      } else {
        setMessage(`You caught another ${catchItem.name}!`);
      }
    }
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
  }

  if (!game) return <p>Loading...</p>;

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
                <span>{item.name}</span>
                <b style={{ marginLeft: 2 }}>{game[item.key]}</b>
              </li>
            ) : null
          )}
        </ul>
      )}
      <div style={{ paddingTop: 70 }}>
        <h1>Wildlife Hunter</h1>
        <button className='poke-button' onClick={() => {/* Check long grass logic */ }}>
          🌾 Check Long Grass
        </button>
        {game.fwrod > 0 && (
          <button className='poke-button' onClick={goFreshwaterFishing} style={{ margin: 12 }}>🎣 Go Freshwater Fishing</button>
        )}
        {game.swrod > 0 && (
          <button className='poke-button' onClick={goSaltwaterFishing} style={{ margin: 12 }}>🪝 Go Saltwater Fishing</button>
        )}
        <p style={{ marginTop: 16 }}>{message}</p>
        <button className='poke-button' onClick={() => router.push('/store')}>Go to Store</button>
        <button className='poke-button' onClick={() => router.push('/bag')}>Open Inventory</button>
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
        .poke-button:hover:enabled {
          background: #e0e0e0;
          border-color: #888;
        }
        .poke-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
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
