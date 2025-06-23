import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Battle component
const Battle = dynamic(() => import('../components/battle.js'), { ssr: false });

export default function Home() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');
  const [inBattle, setInBattle] = useState(false);

  // Load pokedex.json
  useEffect(() => {
    fetch('/pokedex.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load pokedex.json', err));
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
    setInBattle(false);
    setMessage(`A wild ${random.name} appeared!`);
  };

  const tryCatch = (ballType) => {
    if (!wild) return;

    const { stage, legendary } = wild;
    const inventory = { ...game.inventory };
    const pokedex = [...game.pokedex];
    const caughtBefore = inventory[wild.id] || 0;
    const updated = { ...game };

    const fail = (msg) => { setMessage(msg); return; };

    if (ballType === 'pokeball') {
      if (updated.pokeballs < 1) return fail('No Pokéballs left!');
      if (stage > 1 || legendary) return fail('Too strong for a Pokéball!');
      updated.pokeballs--;
    }

    if (ballType === 'greatball') {
      if (updated.greatballs < 1) return fail('No Great Balls!');
      if (stage !== 2) return fail('Only works on middle evolutions!');
      updated.greatballs--;
    }

    if (ballType === 'ultraball') {
      if (updated.ultraballs < 1) return fail('No Ultra Balls!');
      if (stage !== 3 || legendary) return fail('Only for 3rd stage non-legendaries!');
      updated.ultraballs--;
    }

    if (ballType === 'masterball') {
      if (updated.masterballs < 1) return fail('No Master Balls!');
      if (!legendary) return fail('Only for Legendaries!');
      updated.masterballs--;
    }

    inventory[wild.id] = caughtBefore + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

    updated.inventory = inventory;
    updated.pokedex = pokedex;

    saveGame(updated);
    setMessage(`🎉 You caught ${wild.name}!`);
    setWild(null);
    setInBattle(false);
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
            <button onClick={() => tryCatch('pokeball')}>🎯 Pokéball</button>
            <button onClick={() => tryCatch('greatball')}>🎯 Great Ball</button>
            <button onClick={() => tryCatch('ultraball')}>🎯 Ultra Ball</button>
            <button onClick={() => tryCatch('masterball')}>🎯 Master Ball</button>
            <button onClick={() => setInBattle(true)} style={{ marginLeft: '10px' }}>⚔️ Battle</button>
          </div>
        </div>
      )}

      {inBattle && wild && (
        <div style={{ marginTop: '20px' }}>
          <Battle wild={wild} game={game} setGame={saveGame} />
          <button onClick={() => { setInBattle(false); setWild(null); }}>❌ Flee</button>
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
