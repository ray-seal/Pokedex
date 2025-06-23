import { useEffect, useState } from 'react';
import Link from 'next/link';

// Utility: determine Pokémon stage from pokedex data
function getStage(mon) {
  // Simple logic: 
  // - If legendary, stage = 'legendary'
  // - If evolution is null/undefined or has no evolutions, stage 1 (base)
  // - If evolves_from is present, it's stage 2 or 3 depending on data shape
  if (mon.is_legendary || mon.legendary) return 'legendary';
  // Some pokedex.json files use 'evolves_from' or 'prev_evolution'
  if (!mon.evolves_from && !mon.prev_evolution) return 1;
  // If it has both evolves_from and prev_evolution, may be stage 3
  // If previous evolution itself has a prev_evolution, this is stage 3
  if (mon.evolves_from || mon.prev_evolution) {
    const prev = mon.evolves_from || (mon.prev_evolution && mon.prev_evolution[0]?.num);
    if (prev) return 2;
  }
  // Fallback
  return 1;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');
  const [starterChoice, setStarterChoice] = useState('');
  const [starterError, setStarterError] = useState('');

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

    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('gameState'));
    } catch (e) {
      // Ignore
    }
    if (!saved) {
      // Don't prompt, show UI for starter
      setGame(null);
    } else {
      setGame(saved);
    }
  }, [data]);

  // Handle starter selection from UI
  const handleStarterSelect = () => {
    const validStarters = ['bulbasaur', 'charmander', 'squirtle'];
    if (!starterChoice || !validStarters.includes(starterChoice.toLowerCase())) {
      setStarterError('Invalid starter. Please choose Bulbasaur, Charmander, or Squirtle.');
      return;
    }
    const starterData = data.find(p => p.name.toLowerCase() === starterChoice.toLowerCase());
    if (!starterData) {
      setStarterError('Starter not found. Please check spelling.');
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
    setStarterError('');
  };

  const saveGame = (updated) => {
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
  };

  const search = () => {
    if (!data.length) return;
    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setMessage(`A wild ${random.name} appeared!`);
  };

  // Determine what ball is needed for the wild Pokémon
  function getRequiredBall(mon) {
    if (!mon) return 'pokeball';
    if (mon.is_legendary || mon.legendary) return 'masterball';
    const stage = getStage(mon);
    if (stage === 1) return 'pokeball';
    if (stage === 2) return 'greatball';
    if (stage === 3) return 'ultraball';
    return 'pokeball';
  }

  // For pokedex.jsons that use evolution chains, try to detect stage 3 (third evolution)
  function isStage3(mon) {
    // If it has both evolves_from and the previous evolution has evolves_from, it's stage 3
    if (mon.evolves_from) {
      const prev = data.find(p => p.name.toLowerCase() === mon.evolves_from.toLowerCase());
      if (prev && (prev.evolves_from || prev.prev_evolution))
        return true;
    }
    return false;
  }

  const tryCatch = () => {
    if (!wild || !game) return;

    const ballType = getRequiredBall(wild);
    let ballKey = '';
    if (ballType === 'pokeball') ballKey = 'pokeballs';
    else if (ballType === 'greatball') ballKey = 'greatballs';
    else if (ballType === 'ultraball') ballKey = 'ultraballs';
    else if (ballType === 'masterball') ballKey = 'masterballs';

    if (!game[ballKey] || game[ballKey] < 1) {
      setMessage(`You need a ${ballType.charAt(0).toUpperCase() + ballType.slice(1)} to catch this Pokémon!`);
      return;
    }

    const inventory = { ...game.inventory };
    const pokedex = [...game.pokedex];
    const caughtBefore = inventory[wild.id] || 0;

    inventory[wild.id] = caughtBefore + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

    const updated = {
      ...game,
      [ballKey]: game[ballKey] - 1,
      inventory,
      pokedex,
    };

    saveGame(updated);
    setMessage(`You caught ${wild.name} using a ${ballType.charAt(0).toUpperCase() + ballType.slice(1)}!`);
    setWild(null);
  };

  // UI for catching: show which ball is required and how many the user has
  const renderCatchButton = () => {
    if (!wild || !game) return null;
    const ballType = getRequiredBall(wild);
    let ballKey = '';
    if (ballType === 'pokeball') ballKey = 'pokeballs';
    else if (ballType === 'greatball') ballKey = 'greatballs';
    else if (ballType === 'ultraball') ballKey = 'ultraballs';
    else if (ballType === 'masterball') ballKey = 'masterballs';
    const userBalls = game[ballKey] || 0;

    return (
      <button onClick={tryCatch} disabled={userBalls < 1}>
        🎯 Throw {ballType.charAt(0).toUpperCase() + ballType.slice(1)} ({userBalls} left)
      </button>
    );
  };

  if (!data.length) return <p>Loading...</p>;
  // Show starter selection UI if not initialized
  if (!game) {
    return (
      <main style={{ fontFamily: 'monospace', padding: '20px' }}>
        <h1>🎮 Pokémon Catcher</h1>
        <h2>Choose your starter Pokémon</h2>
        <input
          type="text"
          placeholder="Bulbasaur, Charmander, or Squirtle"
          value={starterChoice}
          onChange={e => setStarterChoice(e.target.value)}
        />
        <button onClick={handleStarterSelect}>Start Game</button>
        {starterError && <p style={{ color: 'red' }}>{starterError}</p>}
      </main>
    );
  }

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>🎯 Pokéballs: {game.pokeballs} | Great Balls: {game.greatballs} | Ultra Balls: {game.ultraballs} | Master Balls: {game.masterballs}</p>

      <button onClick={search}>🔍 Search for Pokémon</button>

      {wild && (
        <div style={{ marginTop: '20px' }}>
          <h2>🌿 A wild {wild.name} appears!</h2>
          <img src={wild.sprite} alt={wild.name} width="64" onError={e => (e.target.style.display = 'none')} />
          <div style={{ marginTop: '10px' }}>
            {renderCatchButton()}
          </div>
          <p style={{ fontSize: 'smaller', marginTop: '5px' }}>
            Required Ball: <b>{getRequiredBall(wild).charAt(0).toUpperCase() + getRequiredBall(wild).slice(1)}</b>
          </p>
        </div>
      )}

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      <hr style={{ marginTop: '30px' }} />
      <h2>📘 Pokédex</h2>
      <ul>
        {game.pokedex.sort((a, b) => a - b).map(id => {
          const p = data.find(mon => mon.id === id);
          if (!p) return null;
          return (
            <li key={id}>
              {p.sprite && <img src={p.sprite} alt={p.name} width="32" onError={e => (e.target.style.display = 'none')} />} {p.name} ×{game.inventory[id]}
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