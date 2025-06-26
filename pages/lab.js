import { useEffect, useState } from 'react';
import Link from 'next/link';
import wildlifejournal from '../public/wildlifejournal.json';

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
    const animal = wildlifejournal.find(p => p.id === parseInt(id));
    setMessage(`🧪 You sold a duplicate ${animal.name} for 25 coins.`);
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
      <h1>🧪 Wildlife Research Lab</h1>
      <p>💰 Coins: {game.coins}</p>

      {duplicatesArr.length === 0 ? (
        <p>You have no duplicates to sell.</p>
      ) : (
        <ul>
          {duplicatesArr.map(([id, count]) => {
            const animal = wildlifejournal.find(mon => mon.id === parseInt(id));
            return (
              <li key={id}>
                <img src={animal.sprite} alt={animal.name} width="32" /> {animal.name} ×{count}
                <button onClick={() => handleSell(animal.id)} style={{ marginLeft: '10px' }}>
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
