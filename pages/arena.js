import { useEffect, useState } from 'react';
import pokedex from '../public/pokedex.json';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [wildHP, setWildHP] = useState(100);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) return;

    if (!saved.playerHP) saved.playerHP = 100; // Init player HP if missing
    setGame(saved);
    spawnWild();
  }, []);

  const spawnWild = () => {
    const random = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWild(random);
    setWildHP(100);
    setMessage(`A wild ${random.name} appeared!`);
  };

  const saveGame = (updated) => {
    localStorage.setItem("gameState", JSON.stringify(updated));
    setGame(updated);
  };

  const attack = () => {
    if (!wild || !game || game.playerHP <= 0) return;

    const damageToWild = Math.floor(Math.random() * 30) + 10;
    const damageToPlayer = Math.floor(Math.random() * 20) + 5;

    const newWildHP = Math.max(0, wildHP - damageToWild);
    const newPlayerHP = Math.max(0, game.playerHP - damageToPlayer);

    setWildHP(newWildHP);
    const updated = { ...game, playerHP: newPlayerHP };
    saveGame(updated);

    if (newPlayerHP === 0) {
      setMessage(`You fainted! Visit the Pokémon Center to heal.`);
      return;
    }

    if (newWildHP === 0) {
      setMessage(`You defeated ${wild.name}! Choose a reward below.`);
    } else {
      setMessage(`You dealt ${damageToWild} and took ${damageToPlayer} damage.`);
    }
  };

  const rewardCoins = () => {
    if (!wild || wildHP > 0) return;

    const updated = { ...game, coins: game.coins + 50 };
    saveGame(updated);
    setMessage(`💰 You earned 50 coins!`);
    spawnWild();
  };

  const tryCatch = (type) => {
    if (!wild || wildHP > 0) return;

    const { stage, legendary } = wild;
    const updated = { ...game };
    const inventory = { ...game.inventory };
    const dex = [...game.pokedex];
    const id = wild.id;

    const alreadyCaught = inventory[id] || 0;

    const ballCheck = {
      pokeball: stage === 1 && updated.pokeballs > 0,
      greatball: stage <= 2 && updated.greatballs > 0,
      ultraball: stage <= 3 && !legendary && updated.ultraballs > 0,
      masterball: legendary && updated.masterballs > 0 && dex.length === pokedex.length - 1,
    };

    if (!ballCheck[type]) {
      setMessage("❌ Cannot catch this Pokémon with that ball.");
      return;
    }

    // Deduct ball
    updated[`${type}s`] -= 1;

    // Add to inventory and dex
    inventory[id] = alreadyCaught + 1;
    if (!dex.includes(id)) dex.push(id);

    updated.inventory = inventory;
    updated.pokedex = dex;

    saveGame(updated);
    setMessage(`🎉 You caught ${wild.name}!`);
    spawnWild();
  };

  const runAway = () => {
    setMessage("🏃 You ran away safely...");
    spawnWild();
  };

  if (!game || !wild) return <p>Loading arena...</p>;

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: '20px',
      background: 'url(/backgrounds/arena.png) center/cover no-repeat',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <h1>⚔️ Battle Arena</h1>
      <p>❤️ Your HP: {game.playerHP}</p>
      <hr />
      <h2>🌿 Wild Encounter</h2>
      <p>{wild.name} (HP: {wildHP})</p>
      <img src={wild.sprite} alt={wild.name} width="64" />
      <br /><br />
      {wildHP > 0 ? (
        <>
          <button onClick={attack}>🗡️ Attack</button>{' '}
          <button onClick={runAway}>🏃 Run</button>
        </>
      ) : (
        <>
          <button onClick={rewardCoins}>💰 Claim 50 Coins</button>{' '}
          <button onClick={() => tryCatch("pokeball")}>🔴 Pokéball</button>{' '}
          <button onClick={() => tryCatch("greatball")}>🔵 Great Ball</button>{' '}
          <button onClick={() => tryCatch("ultraball")}>🟣 Ultra Ball</button>{' '}
          <button onClick={() => tryCatch("masterball")}>🟡 Master Ball</button>
        </>
      )}
      <p style={{ marginTop: '10px' }}>{message}</p>
      <hr />
      <a href="/" style={{ color: '#fff' }}>⬅️ Back to Main Menu</a>
    </main>
  );
}
