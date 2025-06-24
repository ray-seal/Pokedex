import { useEffect, useState } from 'react';
import Link from 'next/link';
import data from '../public/pokedex.json';

export default function Store() {
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

  const ballPrices = {
    pokeball: 25,
    greatball: 50,
    ultraball: 75,
    masterball: 1000,
  };

  const handlePurchase = (type) => {
    if (!game) return;

    if (type === "masterball") {
      const nonLegendary = data.filter(p => !p.legendary).map(p => p.id);
      const caughtAll = nonLegendary.every(id => game.pokedex.includes(id));
      if (!caughtAll) {
        setMessage("🛑 You must complete the Pokédex (excluding legendaries) to buy a Master Ball.");
        return;
      }
    }

    const cost = ballPrices[type];
    if (game.coins < cost) {
      setMessage("❌ Not enough coins.");
      return;
    }

    const updatedGame = { ...game };
    updatedGame.coins -= cost;
    updatedGame[`${type}s`] += 1;

    saveGame(updatedGame);
    setMessage(`✅ You bought a ${type.replace("ball", " Ball")}!`);
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div
  style={{
    minHeight: '100vh',
    backgroundImage: 'url("/store-bg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: 'monospace',
    padding: '20px'
  }}
>
  <h1>🛒 PokéMart</h1>
  <p>💰 Coins: {game.coins}</p>

  <button onClick={() => handlePurchase("pokeball")}>
    Buy Pokéball (25 coins)
  </button><br /><br />

  <button onClick={() => handlePurchase("greatball")}>
    Buy Great Ball (50 coins)
  </button><br /><br />

  <button onClick={() => handlePurchase("ultraball")}>
    Buy Ultra Ball (75 coins)
  </button><br /><br />

  <button onClick={() => handlePurchase("masterball")}>
    Buy Master Ball (1000 coins)
  </button>

  <p style={{ marginTop: '20px' }}>{message}</p>

  <br />
  <Link href="/">🏠 Back to Main Page</Link>
</div>
  );
}
