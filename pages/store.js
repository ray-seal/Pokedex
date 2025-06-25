import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ITEMS = [
  { key: 'pokeballs', name: 'Poké Ball', emoji: '🔴', price: 25 },
  { key: 'greatballs', name: 'Great Ball', emoji: '🔵', price: 50 },
  { key: 'ultraballs', name: 'Ultra Ball', emoji: '🟡', price: 75 },
  { key: 'masterballs', name: 'Master Ball', emoji: '🟣', price: 500 },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', price: 30 },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🧴', price: 60 },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', price: 100 },
];

export default function Store() {
  const [game, setGame] = useState(null);
  const [tab, setTab] = useState('buy');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      router.push('/');
      return;
    }
    setGame(saved);
  }, []);

  if (!game) return <p>Loading store...</p>;

  function handleBuy(item) {
    if (game.coins < item.price) {
      setMessage(`Not enough coins for ${item.name}!`);
      return;
    }
    const updated = { ...game, coins: game.coins - item.price };
    updated[item.key] = (updated[item.key] || 0) + 1;
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage(`Bought 1 ${item.name} for ${item.price} coins!`);
  }

  function handleSell(item) {
    if (!game[item.key] || game[item.key] < 1) {
      setMessage(`You don't have any ${item.name} to sell!`);
      return;
    }
    const sellPrice = Math.floor(item.price / 2);
    const updated = { ...game, coins: game.coins + sellPrice };
    updated[item.key] = game[item.key] - 1;
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage(`Sold 1 ${item.name} for ${sellPrice} coins!`);
  }

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
      <h1 style={{ marginTop: 32 }}>🛒 Pokémart</h1>
      <h2>Coins: <span style={{ color: '#ffde59' }}>{game.coins}</span></h2>
      <div style={{ display: 'flex', gap: 18, margin: '18px 0 0 0' }}>
        <button
          className="poke-button"
          style={{
            background: tab === 'buy' ? '#e0e0e0' : '#f9f9f9',
            fontWeight: tab === 'buy' ? 'bold' : 'normal',
          }}
          onClick={() => { setTab('buy'); setMessage(''); }}
        >Buy Items</button>
        <button
          className="poke-button"
          style={{
            background: tab === 'sell' ? '#e0e0e0' : '#f9f9f9',
            fontWeight: tab === 'sell' ? 'bold' : 'normal',
          }}
          onClick={() => { setTab('sell'); setMessage(''); }}
        >Sell Items</button>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.30)',
        borderRadius: 16,
        padding: 28,
        minWidth: 280,
        marginTop: 24,
      }}>
        {tab === 'buy' && (
          <>
            <h3>Buy Items</h3>
            <table style={{ width: '100%', color: 'white' }}>
              <thead>
                <tr>
                  <th align="left">Item</th>
                  <th>Owned</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map(item => (
                  <tr key={item.key}>
                    <td>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span> {item.name}
                    </td>
                    <td style={{ textAlign: 'center' }}>{game[item.key] || 0}</td>
                    <td style={{ color: '#ffde59', fontWeight: 'bold' }}>{item.price}🪙</td>
                    <td>
                      <button className="poke-button" style={{ fontSize: 14, padding: '2px 12px' }} onClick={() => handleBuy(item)}>
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {tab === 'sell' && (
          <>
            <h3>Sell Items (50% Value)</h3>
            <table style={{ width: '100%', color: 'white' }}>
              <thead>
                <tr>
                  <th align="left">Item</th>
                  <th>Owned</th>
                  <th>Sell For</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map(item => (
                  <tr key={item.key}>
                    <td>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span> {item.name}
                    </td>
                    <td style={{ textAlign: 'center' }}>{game[item.key] || 0}</td>
                    <td style={{ color: '#ffde59', fontWeight: 'bold' }}>{Math.floor(item.price / 2)}🪙</td>
                    <td>
                      <button
                        className="poke-button"
                        style={{ fontSize: 14, padding: '2px 12px' }}
                        disabled={!game[item.key] || game[item.key] < 1}
                        onClick={() => handleSell(item)}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <p style={{ minHeight: 38 }}>{message}</p>
      </div>

      <button className="poke-button" onClick={() => router.push('/')} style={{ marginTop: 32 }}>
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
        .poke-button:hover:enabled {
          background: #e0e0e0;
          border-color: #888;
        }
        .poke-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
