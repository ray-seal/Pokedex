 import { useEffect, useState } from 'react';
import Link from 'next/link';
import data from '../public/pokedex.js';
import dynamic from 'next/dynamic';

const Battle = dynamic(() => import('../components/battle.js'), { ssr: false });

export default function Home() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');
  const [inBattle, setInBattle] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      const starter = prompt('Choose your starter: Bulbasaur, Charmander or Squirtle');
      const starterData = data.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!starterData) return alert('Invalid starter. Reload to try again.');
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
  }, []);

  const saveGame = (updatedGame) => {
    setGame(updatedGame);
    localStorage.setItem('gameState', JSON.stringify(updatedGame));
  };

  const search = () => {
    const encounter = data[Math.floor(Math.random() * data.length)];
    setWild(encounter);
    setMessage(`A wild ${encounter.name} appeared!`);
    setInBattle(false); // reset any active battle
  };

  const tryCatch = (ballType) => {
    if (!wild) return;

    const { stage, legendary } = wild;
    const inventory = { ...game.inventory };
    const pokedex = [...game.pokedex];
    const caughtBefore = inventory[wild.id] || 0;

    const updatedGame = { ...game };

    if (ballType === 'pokeball') {
      if (game.pokeballs < 1) return setMessage('No Pokéballs left!');
      if (stage > 1 || legendary) return setMessage('This Pokémon resists a Pokéball!');
      updatedGame.pokeballs -= 1;
    }

    if (ballType === 'greatball') {
      if (game.greatballs < 1) return setMessage('No Great Balls left!');
      if (stage !== 2) return setMessage('Only middle evolutions can be caught with Great Balls.');
      updatedGame.greatballs -= 1;
    }

    if (ballType === 'ultraball') {
      if (game.ultraballs < 1) return setMessage('No Ultra Balls left!');
      if (stage !== 3 || legendary) return setMessage('Only 3rd stage non-legendaries can be caught with Ultra Balls.');
      updatedGame.ultraballs -= 1;
    }

    if (ballType === 'masterball') {
      if (game.masterballs < 1) return setMessage('No Master Balls left!');
      if (!legendary) return setMessage('Save Master Balls for Legendary Pokémon.');
      updatedGame.masterballs -= 1;
    }

    inventory[wild.id] = caughtBefore + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

    updatedGame.inventory = inventory;
    updatedGame.pokedex = pokedex;

    saveGame(updatedGame);
    setMessage(`You caught ${wild.name}!`);
    setWild(null);
    setInBattle(false);
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>
        🎯 Pokéballs: {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}
      </p>

      <button onClick={search}>🔍 Search for Pokémon</button>
      <button onClick={() => setInBattle(true)} disabled={!wild} style={{ marginLeft: '10px' }}>
        ⚔️ Enter Battle
      </button>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      {wild && !inBattle && (
        <div style={{ marginTop: '20px' }}>
          <h2>🌿 A wild {wild.name} appears!</h2>
          <img src={wild.sprite} alt={wild.name} width="64" />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => tryCatch('pokeball')}>🎯 Pokéball</button>
            <button onClick={() => tryCatch('greatball')}>🎯 Great Ball</button>
            <button onClick={() => tryCatch('ultraball')}>🎯 Ultra Ball</button>
            <button onClick={() => tryCatch('masterball')}>🎯 Master Ball</button>
          </div>
        </div>
      )}

      {wild && inBattle && (
        <div style={{ marginTop: '20px' }}>
          <Battle wild={wild} game={game} setGame={saveGame} />
          <button onClick={() => { setInBattle(false); setWild(null); }} style={{ marginTop: '10px' }}>
            ❌ Flee Battle
          </button>
        </div>
      )}

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