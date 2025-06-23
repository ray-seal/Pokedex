import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/pokedex.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load pokedex:', err));
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      const starter = prompt('Choose your starter: Bulbasaur, Charmander, or Squirtle');
      const starterData = data.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!starterData) {
        alert('Invalid starter. Reload to try again.');
        return;
      }
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
      localStorage.setItem('gameState', JSON.stringify(newGame));
    } else {
      setGame(saved);
    }
  }, [data]);

  const saveGame = (updated) => {
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
  };

  const search = () => {
    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setMessage(`A wild ${random.name} appeared!`);
  };

  const tryCatch = (ballType) => {
    if (!wild) return;

    const { id, name, stage, legendary } = wild;
    const updated = { ...game };
    const inventory = { ...game.inventory };
    const pokedex = [...game.pokedex];
    const caughtBefore = inventory[id] || 0;

    // ✅ Catch rules
    if (ballType === 'pokeball') {
      if (stage !== 1) return setMessage(`${name} resists a Pokéball!`);
      if (game.pokeballs < 1) return setMessage('No Pokéballs left!');
      updated.pokeballs -= 1;
    }

    if (ballType === 'greatball') {
      if (stage > 2) return setMessage(`${name} resists a Great Ball!`);
      if (game.greatballs < 1) return setMessage('No Great Balls left!');
      updated.greatballs -= 1;
    }

    if (ballType === 'ultraball') {
      if (legendary) return setMessage(`${name} resists an Ultra Ball!`);
      if (game.ultraballs < 1) return setMessage('No Ultra Balls left!');
      updated.ultraballs -= 1;
    }

    if (ballType === 'masterball') {
      if (!legendary) return setMessage(`Save Master Balls for legendary Pokémon!`);
      if (game.masterballs < 1) return setMessage('No Master Balls left!');
      updated.masterballs -= 1;
    }

    // Success!
    inventory[id] = caughtBefore + 1;
    if (!pokedex.includes(id)) pokedex.push(id);
    updated.inventory = inventory;
    updated.pokedex = pokedex;

    saveGame(updated);
    setMessage(`🎉 You caught ${name}!`);
    setWild(null);
  };

  if (!game || !data.length) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>
        🎯 Pokéballs: {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}
      </p>

      <button onClick={search}>🔍 Search for Pokémon</button>

      {wild && (
        <div style={{ marginTop: '20px' }}>
          <h2>🌿 A wild {wild.name} appears!</h2>
          <img src={wild.sprite} alt={wild.name} width="64" />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => tryCatch('pokeball')}>Pokéball</button>
            <button onClick={() => tryCatch('greatball')}>Great Ball</button>
            <button onClick={() => tryCatch('ultraball')}>Ultra Ball</button>
            <button onClick={() => tryCatch('masterball')}>Master Ball</button>
          </div>
        </div>
      )}

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      <hr style={{ marginTop: '30px' }} />
      <h2>📘 Pokédex</h2>
      <ul>
        {game.pokedex.sort((a, b) => a - b).map(id => {
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
      <br />
      <Link href="/arena">⚔️ Enter Arena</Link>
    </main>
  );
}