import { useState, useEffect } from 'react';
import data from '../public/pokedex.json';
import Link from 'next/link';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [wildHP, setWildHP] = useState(100);
  const [message, setMessage] = useState('');
  const [reward, setReward] = useState(null);

  // Load game state & team
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (saved) {
      setGame(saved);
      setPlayerHP(saved.playerHP ?? 100);
      encounterWild();
    }
  }, []);

  const saveGame = (updated) => {
    localStorage.setItem('gameState', JSON.stringify(updated));
    setGame(updated);
  };

  const encounterWild = () => {
    const wildMon = data[Math.floor(Math.random() * data.length)];
    setWild(wildMon);
    setWildHP(100);
    setMessage(`A wild ${wildMon.name} appeared!`);
  };

  const attack = () => {
    if (playerHP <= 0) {
      setMessage("You have no HP left! Visit the Pokémon Center.");
      return;
    }

    const damage = Math.floor(Math.random() * 20) + 10;
    const received = Math.floor(Math.random() * 15) + 5;

    const newWildHP = Math.max(wildHP - damage, 0);
    const newPlayerHP = Math.max(playerHP - received, 0);
    setWildHP(newWildHP);
    setPlayerHP(newPlayerHP);

    const updatedGame = { ...game, playerHP: newPlayerHP };
    saveGame(updatedGame);

    if (newPlayerHP === 0) {
      setMessage("You fainted! Go heal at the Pokémon Center.");
    } else if (newWildHP === 0) {
      setMessage(`You defeated ${wild.name}!`);
      setReward(true);
    } else {
      setMessage(`You dealt ${damage} and took ${received}.`);
    }
  };

  const run = () => {
    if (playerHP <= 0) {
      setMessage("You can't run while fainted!");
      return;
    }
    encounterWild();
    setReward(null);
  };

  const claimCoins = () => {
    const updated = {
      ...game,
      coins: game.coins + 50,
      playerHP,
    };
    saveGame(updated);
    setMessage('You earned 50 coins!');
    setReward(null);
    encounterWild();
  };

  const tryCatch = (ballType) => {
    const stage = wild.stage;
    const { legendary } = wild;
    const updated = { ...game };
    const inventory = { ...updated.inventory };

    if (ballType === 'pokeball') {
      if (updated.pokeballs < 1) return setMessage("No Pokéballs left!");
      if (stage > 1 || legendary) return setMessage("Too strong for a Pokéball!");
      updated.pokeballs -= 1;
    } else if (ballType === 'greatball') {
      if (updated.greatballs < 1) return setMessage("No Great Balls left!");
      if (stage > 2) return setMessage("Too strong for a Great Ball!");
      updated.greatballs -= 1;
    } else if (ballType === 'ultraball') {
      if (updated.ultraballs < 1) return setMessage("No Ultra Balls left!");
      if (legendary) return setMessage("Use a Master Ball for Legendaries!");
      updated.ultraballs -= 1;
    } else if (ballType === 'masterball') {
      if (updated.masterballs < 1) return setMessage("No Master Balls left!");
      if (!legendary) return setMessage("Save this for Legendaries!");
      updated.masterballs -= 1;
    }

    if (!updated.pokedex.includes(wild.id)) updated.pokedex.push(wild.id);
    inventory[wild.id] = (inventory[wild.id] || 0) + 1;
    updated.inventory = inventory;

    saveGame(updated);
    setMessage(`You caught ${wild.name}!`);
    setReward(null);
    encounterWild();
  };

  if (!game || !wild) return <p>Loading...</p>;

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: '20px',
      background: 'url("/arena-bg.jpg") no-repeat center center',
      backgroundSize: 'cover',
      color: 'white',
      textShadow: '2px 2px 4px black',
      minHeight: '100vh'
    }}>
      <h1>🏟️ Battle Arena</h1>
      <p>❤️ Your HP: {playerHP} / 100</p>
      <p>⚔️ Wild {wild.name}'s HP: {wildHP} / 100</p>
      <img src={wild.sprite} alt={wild.name} width="96" />

      <div style={{ marginTop: '20px' }}>
        <button onClick={attack}>⚔️ Attack</button>
        <button onClick={run}>🏃 Run</button>
      </div>

      {reward && (
        <div style={{ marginTop: '20px' }}>
          <p>🎉 Victory! Choose your reward:</p>
          <button onClick={claimCoins}>💰 50 Coins</button>
          <div>
            <button onClick={() => tryCatch('pokeball')}>Pokéball</button>
            <button onClick={() => tryCatch('greatball')}>Great Ball</button>
            <button onClick={() => tryCatch('ultraball')}>Ultra Ball</button>
            <button onClick={() => tryCatch('masterball')}>Master Ball</button>
          </div>
        </div>
      )}

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}

      <hr />
      <Link href="/">🏠 Back to Home</Link> | <Link href="/center">❤️ Pokémon Center</Link>
    </main>
  );
}
