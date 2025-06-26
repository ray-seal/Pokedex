import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ITEMS = [
  { key: 'pokeballs', name: 'Small Net', emoji: '🕸️', price: 25 },
  { key: 'greatballs', name: 'Medium Net', emoji: '🪢', price: 50 },
  { key: 'ultraballs', name: 'Large Net', emoji: '🪣', price: 75 },
  { key: 'masterballs', name: 'Large Chains', emoji: '⛓️', price: 500 },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', price: 30 },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🧴', price: 60 },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', price: 100 },
];

export default function Store() {
  const [game, setGame] = useState(null);
  const [tab, setTab] = useState('buy');
  const [message, setMessage] = useState('');
  const [buyQuantities, setBuyQuantities] = useState({});
  const [sellQuantities, setSellQuantities] = useState({});
  const router = useRouter();

  // Update buy/sell quantities when switching tabs or on initial load
  useEffect(() => {
    if (game) {
      // For buy: max user can afford
      const newBuy = {};
      const newSell = {};
      ITEMS.forEach(item => {
        const maxBuy = Math.floor(game.coins / item.price);
        newBuy[item.key] = maxBuy >= 1 ? 1 : 0;
        newSell[item.key] = game[item.key] > 0 ? 1 : 0;
      });
      setBuyQuantities(newBuy);
      setSellQuantities(newSell);
    }
  }, [game, tab]);

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
    const quantity = buyQuantities[item.key] || 1;
    const maxBuy = Math.floor(game.coins / item.price);
    if (maxBuy < 1) {
      setMessage(`Not enough coins for ${item.name}!`);
      return;
    }
    const qty = Math.min(quantity, maxBuy);
    const totalCost = qty * item.price;
    const updated = { ...game, coins: game.coins - totalCost };
    updated[item.key] = (updated[item.key] || 0) + qty;
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage(`Bought ${qty} ${item.name}${qty > 1 ? 's' : ''} for ${totalCost} coins!`);
    // Update buyQuantities for new max
    const newMax = Math.floor(updated.coins / item.price);
    setBuyQuantities(q => ({ ...q, [item.key]: newMax >= 1 ? 1 : 0 }));
    setSellQuantities(q => ({ ...q, [item.key]: updated[item.key] }));
  }

  function handleSell(item) {
    const owned = game[item.key] || 0;
    const quantity = sellQuantities[item.key] || 1;
    if (owned < 1) {
      setMessage(`You don't have any ${item.name} to sell!`);
      return;
    }
    const qty = Math.min(quantity, owned);
    const sellPrice = Math.floor(item.price / 2);
    const totalGain = qty * sellPrice;
    const updated = { ...game, coins: game.coins + totalGain };
    updated[item.key] = owned - qty;
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage(`Sold ${qty} ${item.name}${qty > 1 ? 's' : ''} for ${totalGain} coins!`);
    // Update sellQuantities for new max
    setSellQuantities(q => ({ ...q, [item.key]: updated[item.key] > 0 ? 1 : 0 }));
    setBuyQuantities(q => ({ ...q, [item.key]: Math.floor(updated.coins / item.price) >= 1 ? 1 : 0 }));
  }

  function renderQuantityDropdown(type, item, max) {
    // type: "buy" or "sell"
    const quantities = Array.from({ length: max }, (_, i) => i + 1);
    if (max < 1) return <span style={{ color: '#aaa', fontSize: 13 }}>—</span>;
    return (
      <select
        value={type === "buy" ? (buyQuantities[item.key] || 1) : (sellQuantities[item.key] || 1)}
        style={{
          fontSize: 15,
          padding: '1px 5px',
          borderRadius: 5,
          marginRight: 7,
        }}
        onChange={e => {
          const val = parseInt(e.target.value, 10);
          if (type === "buy") setBuyQuantities(q => ({ ...q, [item.key]: val }));
          else setSellQuantities(q => ({ ...q, [item.key]: val }));
        }}
      >
        {quantities.map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    );
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
      <h1 style={{ marginTop: 32 }}>🛒 Wildlife Supply Store</h1>
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
                  <th>Buy</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map(item => {
                  const owned = game[item.key] || 0;
                  const maxBuy = Math.floor(game.coins / item.price);
                  return (
                    <tr key={item.key}>
                      <td>
                        <span style={{ fontSize: 20 }}>{item.emoji}</span> {item.name}
                      </td>
                      <td style={{ textAlign: 'center' }}>{owned}</td>
                      <td style={{ color: '#ffde59', fontWeight: 'bold' }}>{item.price}🪙</td>
                      <td>
                        {renderQuantityDropdown("buy", item, maxBuy)}
                        <button
                          className="poke-button"
                          style={{ fontSize: 14, padding: '2px 12px' }}
                          disabled={maxBuy < 1}
                          onClick={() => handleBuy(item)}
                        >
                          Buy
                        </button>
                        <span style={{ fontSize: 13, color: '#aaa', marginLeft: 5 }}>
                          {maxBuy > 0 ? `(max: ${maxBuy})` : ''}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
                  <th>Sell</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map(item => {
                  const owned = game[item.key] || 0;
                  const maxSell = owned;
                  return (
                    <tr key={item.key}>
                      <td>
                        <span style={{ fontSize: 20 }}>{item.emoji}</span> {item.name}
                      </td>
                      <td style={{ textAlign: 'center' }}>{owned}</td>
                      <td style={{ color: '#ffde59', fontWeight: 'bold' }}>{Math.floor(item.price / 2)}🪙</td>
                      <td>
                        {renderQuantityDropdown("sell", item, maxSell)}
                        <button
                          className="poke-button"
                          style={{ fontSize: 14, padding: '2px 12px' }}
                          disabled={owned < 1}
                          onClick={() => handleSell(item)}
                        >
                          Sell
                        </button>
                        <span style={{ fontSize: 13, color: '#aaa', marginLeft: 5 }}>
                          {maxSell > 0 ? `(max: ${maxSell})` : ''}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
