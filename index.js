import { useEffect, useState } from 'react';
import Link from 'next/link';
import data from '../public/pokedex.js';
import Battle from '../components/battle.js';

export default function Home() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState("");
  const [view, setView] = useState('main');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      const starter = prompt("Choose your starter: Bulbasaur, Charmander or Squirtle");
      const starterData = data.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!starterData) return alert("Invalid starter. Reload to try again.");
      const newGame = {
        coins: 500,
        pokeballs: 10,
        greatballs: 0,
        ultraballs: 0,
        masterballs: 0,
        pokedex: [starterData.id],
        inventory: { [starterData.id]: 1 }
      };
      setGame(newGame);
      localStorage.setItem("gameState", JSON.stringify(newGame));
    } else {
      setGame(saved);
    }
  }, []);

  const saveGame = (updatedGame) => {
    setGame(updatedGame);
    localStorage.setItem("gameState", JSON.stringify(updatedGame));
  };

  // Search for a wild Pokémon
  const search = () => {
    const encounter = data[Math.floor(Math.random() * data.length)];
    setWild(encounter);
    setMessage(`A wild ${encounter.name} appeared!`);
    setView('encounter');
  };

  const tryCatch = (ballType) => {
    if (!wild) return;

    const { stage, legendary } = wild;

    const inventory = { ...game.inventory };
    const pokedex = [...game.pokedex];
    const caughtBefore = inventory[wild.id] || 0;

    const updatedGame = { ...game };

    // Deduct ball and apply rules
    if (ballType === 'pokeball') {
      if (game.pokeballs < 1) return setMessage("No Pokéballs left!");
      if (stage > 1 || legendary) return setMessage("This Pokémon resists a Pokéball!");
      updatedGame.pokeballs -= 1;
    }

    if (ballType === 'greatball') {
      if (game.greatballs < 1) return setMessage("No Great Balls left!");
      if (stage !== 2) return setMessage("Only middle evolutions can be caught with Great Balls.");
      updatedGame.greatballs -= 1;
    }

    if (ballType === 'ultraball') {
      if (game.ultraballs < 1) return setMessage("No Ultra Balls left!");
      if (stage !== 3 || legendary) return setMessage("Only 3rd stage non-legendaries can be caught with Ultra Balls.");
      updatedGame.ultraballs -= 1;
    }

    if (ballType === 'masterball') {
      if (game.masterballs < 1) return setMessage("No Master Balls left!");
      if (!legendary) return setMessage("Save Master Balls for Legendary Pokémon.");
      updatedGame.masterballs -= 1;
    }

    // Success
    inventory[wild.id] = caughtBefore + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

    updatedGame.inventory = inventory;
    updatedGame.pokedex = pokedex;

    saveGame(updatedGame);
    setMessage(`You caught ${wild.name}!`);
    setWild(null);
    setView('main');
  };

  if (!game) return <p>Loading...</p>;

  // --- BATTLE RENDERING ---
  if (view === 'battle') {
  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>⚔️ Battle Mode</h1>
      <Battle
        game={game}
        setGame={setGame}
        wild={wild}           // pass the current wild pokemon
        setWild={setWild}     // pass setter (optional)
        back={() => { setView('encounter'); }}
      />
      <button onClick={() => { setView('encounter'); }} style={{ marginTop: '20px' }}>
        ⬅️ Back to Encounter
      </button>
    </main>
  );
}
      </main>
    );
  }
  // ------------------------------

  // --- ENCOUNTER RENDERING ---
  if (view === 'encounter' && wild) {
    return (
      <main style={{ fontFamily: 'monospace', padding: '20px' }}>
        <h1>🎮 Pokémon Catcher</h1>
        <p>💰 Coins: {game.coins}</p>
        <p>
          🎯 Pokéballs: {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}
        </p>
        <hr />
        <h2>🌲 Wild Encounter</h2>
        <p>
          <img src={wild.sprite} alt={wild.name} width="64" style={{ verticalAlign: 'middle' }} /> <b>{wild.name}</b>
          {wild.legendary && <span> ⭐ Legendary</span>}
        </p>
        <p>Stage: {wild.stage}</p>
        <div>
          <button onClick={() => tryCatch('pokeball')}>Throw Pokéball</button>{" "}
          <button onClick={() => tryCatch('greatball')}>Throw Great Ball</button>{" "}
          <button onClick={() => tryCatch('ultraball')}>Throw Ultra Ball</button>{" "}
          <button onClick={() => tryCatch('masterball')}>Throw Master Ball</button>
        </div>
        <div style={{ marginTop: '12px' }}>
          <button onClick={() => setView('battle')}>⚔️ Battle Instead</button>
        </div>
        <div style={{ marginTop: '12px' }}>
          <button onClick={() => { setWild(null); setView('main'); setMessage(""); }}>Run Away</button>
        </div>
        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
        <hr />
        <h2>📘 Pokédex</h2>
        <ul>
          {game.pokedex.map(id => {
            const p = data.find(mon => mon.id === id);
            return (
              <li key={id}>
                <img src={p.sprite} alt={p.name} width="32" /> {p.name} ×{game.inventory[id]}
              </li>
            );
          })}
        </ul>
        <br />
        <Link href="/store">🛍️ Visit the PokéMart</Link>
        <br />
        <Link href="/lab">🧪 Visit Professor Oak's Lab</Link>
      </main>
    );
  }
  // ------------------------------

  // Main view
  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>
        🎯 Pokéballs: {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}
      </p>
      <button onClick={search}>🔍 Search for Pokémon</button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      <hr />
      <h2>📘 Pokédex</h2>
      <ul>
        {game.pokedex.map(id => {
          const p = data.find(mon => mon.id === id);
          return (
            <li key={id}>
              <img src={p.sprite} alt={p.name} width="32" /> {p.name} ×{game.inventory[id]}
            </li>
          );
        })}
      </ul>
      <br />
      <Link href="/store">🛍️ Visit the PokéMart</Link>
      <br />
      <Link href="/lab">🧪 Visit Professor Oak's Lab</Link>
    </main>
  );
}
