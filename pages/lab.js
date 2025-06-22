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
    if (!game || game.inventory[id] <= 1) return;

    const updatedGame = { ...game };
    updatedGame.coins += 25;
    updatedGame.inventory[id] -= 1;

    saveGame(updatedGame);
    const pokemon = data.find(p => p.id === id);
    setMessage(`🧪 You sold a duplicate ${pokemon.name} for 25 coins.`);
  };

  if (!game) return <p>Loading...</p>;

  const duplicates = Object.entries(game.inventory).filter(([id, count]) => count > 1);

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🧪 Professor Oak's Lab</h1>
      <p>💰 Coins: {game.coins}</p>

      {duplicates.length === 0 ? (
        <p>You have no duplicates to sell.</p>
      ) : (
        <ul>
          {duplicates.map(([id, count]) => {
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
    </main>
  );
}
