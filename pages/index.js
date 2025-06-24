import { useEffect, useState } from 'react';
import Link from 'next/link';
import data from '../public/pokedex.json';

export default function Home() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      const starter = prompt("Choose your starter: Bulbasaur, Charmander, or Squirtle");
      const starterData = data.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!starterData) return alert("Invalid starter. Reload to try again.");
      const newGame = {
        coins: 500,
        pokeballs: 10,
        greatballs: 0,
        ultraballs: 0,
        masterballs: 0,
        pokedex: [starterData.id],
        inventory: { [starterData.id]: 1 },
        team: [{ id: starterData.id, hp: 100 }],
        activeIndex: 0
      };
      setGame(newGame);
      localStorage.setItem("gameState", JSON.stringify(newGame));
    } else {
      setGame(saved);
    }
  }, []);

  const saveGame = (updated) => {
    setGame(updated);
    localStorage.setItem("gameState", JSON.stringify(updated));
  };

  const search = () => {
    const rand = data[Math.floor(Math.random() * data.length)];
    setWild(rand);
    setMessage(`A wild ${rand.name} appeared!`);
  };

  const tryCatch = (ballType) => {
    if (!wild) return;
    const updated = { ...game };
    const { stage, legendary } = wild;

    if (ballType === 'pokeball') {
      if (updated.pokeballs < 1) return setMessage("No Pokéballs left!");
      if (stage > 1 || legendary) return setMessage("Too strong for a Pokéball.");
      updated.pokeballs--;
    } else if (ballType === 'greatball') {
      if (updated.greatballs < 1) return setMessage("No Great Balls left!");
      if (stage > 2 || legendary) return setMessage("Too strong for a Great Ball.");
      updated.greatballs--;
    } else if (ballType === 'ultraball') {
      if (updated.ultraballs < 1) return setMessage("No Ultra Balls left!");
      if (legendary) return setMessage("Use a Master Ball for legendary Pokémon.");
      updated.ultraballs--;
    } else if (ballType === 'masterball') {
      if (updated.masterballs < 1) return setMessage("No Master Balls left!");
      if (!legendary) return setMessage("Master Balls are for legendary Pokémon only.");
      updated.masterballs--;
    }

    updated.inventory[wild.id] = (updated.inventory[wild.id] || 0) + 1;
    if (!updated.pokedex.includes(wild.id)) updated.pokedex.push(wild.id);
    saveGame(updated);
    setWild(null);
    setMessage(`You caught ${wild.name}!`);
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>🎯 Balls: Poké {game.pokeballs}, Great {game.greatballs}, Ultra {game.ultraballs}, Master {game.masterballs}</p>
      
      <button onClick={search}>🔍 Search for Pokémon</button>

      {wild && (
  <div style={{ marginTop: '10px' }}>
    <p>A wild {wild.name} appeared!</p>
    <img src={wild.sprite} alt={wild.name} width="96" />
    <button onClick={() => tryCatch('pokeball')}>🎯 Use Pokéball</button>
    <button onClick={() => tryCatch('greatball')}>🎯 Use Great Ball</button>
    <button onClick={() => tryCatch('ultraball')}>🎯 Use Ultra Ball</button>
    <button onClick={() => tryCatch('masterball')}>🎯 Use Master Ball</button>
  </div>
)}

      <p>{message}</p>

      <hr />
      <h2>📘 Pokédex</h2>
      <ul>
        {game.pokedex
          .sort((a, b) => a - b)
          .map(id => {
            const mon = data.find(p => p.id === id);
            return (
              <li key={id}>
                <img src={mon.sprite} alt={mon.name} width="32" /> {mon.name} ×{game.inventory[id]}
              </li>
            );
          })}
      </ul>

      <hr />
      <h3>🔗 Locations</h3>
      <Link href="/store">🛍️ PokéMart</Link><br />
      <Link href="/lab">🧪 Professor Oak's Lab</Link><br />
      <Link href="/arena">🏟️ Battle Arena</Link><br />
      <Link href="/center">🏥 Pokémon Center</Link><br />
      <Link href="/team">👥 Choose Team</Link>
    </main>
  );
}
