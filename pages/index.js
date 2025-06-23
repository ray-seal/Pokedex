import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');

  // Load pokedex.json from /public
  useEffect(() => {
    fetch('/pokedex.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load pokedex:', err));
  }, []);

  // Initialize game state
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

  const tryCatch = () => {
    if (!wild) return;

    const inventory = { ...game.inventory };
    const pokedex = [...game.pokedex];
    const caughtBefore = inventory[wild.id] || 0;

    if (game.pokeballs < 1) return setMessage('No Pokéballs left!');

    inventory[wild.id] = caughtBefore + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

    const updated = {
      ...game,
      pokeballs: game.pokeballs - 1,
      inventory,
      pokedex,
    };

    saveGame(updated);
    setMessage(`You caught ${wild.name}!`);
    setWild(null);
  };

  if (!game || !data.length) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>🎯 Pokéballs: {game.pokeballs}</p>

      <button onClick={search}>🔍 Search for Pokémon</button>

      {wild && (
        <div style={{ marginTop: '20px' }}>
          <h2>🌿 A wild {wild.name} appears!</h2>
          <img src={wild.sprite} alt={wild.name} width="64" />
          <div style={{ marginTop: '10px' }}>
            <button onClick={tryCatch}>🎯 Throw Pokéball</button>
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
    </main>
  );
}
