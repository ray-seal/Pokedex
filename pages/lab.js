import { useEffect, useState } from 'react';
import Link from 'next/link';
import data from '../public/pokedex.json';

export default function Lab() {
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved) setGame(saved);
  }, []);

  const saveGame = (newGame) => {
    setGame(newGame);
    localStorage.setItem("gameState", JSON.stringify(newGame));
  };

  const handleSell = (id) => {
    if (!game || !game.duplicates || !game.duplicates[id] || game.duplicates[id] < 1) return;

    const updatedGame = { ...game };
    updatedGame.coins += 25;
    updatedGame.duplicates = { ...updatedGame.duplicates };
    updatedGame.duplicates[id] -= 1;

    // Remove entry if sold all duplicates
    if (updatedGame.duplicates[id] <= 0) {
      delete updatedGame.duplicates[id];
    }

    saveGame(updatedGame);
    const pokemon = data.find(p => p.id === parseInt(id));
    setMessage(`🧪 You sold a duplicate ${pokemon.name} for 25 coins.`);
  };

  if (!game) return <p>Loading...</p>;

  const duplicatesArr = game.duplicates
    ? Object.entries(game.duplicates).filter(([id, count]) => count > 0)
    : [];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/lab-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'monospace',
        padding: '20px'
      }}
    >
      <h1>🧪 Professor Oak's Lab</h1>
      <p>💰 Coins: {game.coins}</p>

      {duplicatesArr.length === 0 ? (
        <p>You have no duplicates to sell.</p>
      ) : (
        <ul>
          {duplicatesArr.map(([id, count]) => {
            const p = data.find(mon => mon.id === parseInt(id));
            return (
              <li key={id}>
                <img src={p.sprite} alt={p.name} width="32" /> {p.name} ×{count}
                <button onClick={() => handleSell(p.id)} style={{ marginLeft: '10px' }}>
                  Sell for 25 coins
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p style={{ marginTop: '20px' }}>{message}</p>

      <br />
      <Link href="/">🏠 Back to Main Page</Link>
    </div>
  );
}
