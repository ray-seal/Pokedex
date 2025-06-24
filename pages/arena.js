import { useEffect, useState } from 'react';
import pokedex from '../public/pokedex.json';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [wildHP, setWildHP] = useState(100);
  const [message, setMessage] = useState('');
  const [battleOver, setBattleOver] = useState(false);
  const [canCatch, setCanCatch] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      alert('No game found. Go back to start a new game.');
      return;
    }

    if (saved.playerHP !== undefined) {
      setPlayerHP(saved.playerHP);
    }

    setGame(saved);
    encounterNewWild(saved);
  }, []);

  const saveGame = (updatedGame) => {
    localStorage.setItem('gameState', JSON.stringify(updatedGame));
    setGame(updatedGame);
  };

  const encounterNewWild = (gameState) => {
    const wildMon = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWild(wildMon);
    setWildHP(100);
    setMessage(`A wild ${wildMon.name} appeared!`);
    setBattleOver(false);
    setCanCatch(false);
  };

  const attack = () => {
    if (battleOver || !wild) return;

    const playerDamage = Math.floor(Math.random() * 30) + 10;
    const wildDamage = Math.floor(Math.random() * 20) + 5;

    const newWildHP = Math.max(wildHP - playerDamage, 0);
    const newPlayerHP = Math.max(playerHP - wildDamage, 0);

    setWildHP(newWildHP);
    setPlayerHP(newPlayerHP);

    const updatedGame = { ...game, playerHP: newPlayerHP };
    saveGame(updatedGame);

    if (newPlayerHP <= 0) {
      setMessage("You've fainted! Heal at the Center to battle again.");
      setBattleOver(true);
    } else if (newWildHP <= 0) {
      setMessage(`You defeated ${wild.name}! 🎉`);
      setBattleOver(true);
      setCanCatch(true);
    } else {
      setMessage(`You hit ${wild.name} for ${playerDamage} damage. It hit back for ${wildDamage}.`);
    }
  };

  const handleCatch = () => {
    if (!wild || !canCatch) return;

    const { stage, legendary } = wild;
    const updatedGame = { ...game };
    const inventory = { ...updatedGame.inventory };
    const pokedex = [...updatedGame.pokedex];
    const caughtBefore = inventory[wild.id] || 0;

    // Decide which ball is usable
    if (legendary) {
      if (updatedGame.masterballs < 1) return setMessage("You need a Master Ball!");
      updatedGame.masterballs -= 1;
    } else if (stage === 3) {
      if (updatedGame.ultraballs < 1) return setMessage("You need an Ultra Ball!");
      updatedGame.ultraballs -= 1;
    } else if (stage === 2) {
      if (updatedGame.greatballs < 1) return setMessage("You need a Great Ball!");
      updatedGame.greatballs -= 1;
    } else {
      if (updatedGame.pokeballs < 1) return setMessage("You need a Pokéball!");
      updatedGame.pokeballs -= 1;
    }

    inventory[wild.id] = caughtBefore + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

    updatedGame.inventory = inventory;
    updatedGame.pokedex = pokedex;

    setMessage(`🎯 You caught ${wild.name}!`);
    saveGame(updatedGame);
    setCanCatch(false);
  };

  const handleClaim = () => {
    const updatedGame = { ...game, coins: game.coins + 50 };
    saveGame(updatedGame);
    setMessage("💰 You claimed 50 coins!");
    setCanCatch(false);
  };

  const nextBattle = () => {
    encounterNewWild(game);
  };

  if (!game || !wild) return <p>Loading...</p>;

  if (playerHP <= 0) {
    return (
      <main style={{ fontFamily: 'monospace', padding: '20px' }}>
        <h1>⚔️ Battle Arena</h1>
        <p>You fainted. Go to the <a href="/center">Pokémon Center</a> to heal.</p>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>⚔️ Battle Arena</h1>
      <p>👤 Player HP: {playerHP} | 💰 Coins: {game.coins}</p>
      <p>🐾 Wild {wild.name} HP: {wildHP}</p>
      <img src={wild.sprite} alt={wild.name} width="80" />
      <p>{message}</p>

      {!battleOver && (
        <button onClick={attack}>🗡️ Attack</button>
      )}

      {battleOver && canCatch && (
        <>
          <button onClick={handleCatch}>🎯 Catch</button>
          <button onClick={handleClaim}>💰 Claim 50 Coins</button>
        </>
      )}

      {battleOver && !canCatch && (
        <button onClick={nextBattle}>🔁 New Encounter</button>
      )}

      <br /><br />
      <a href="/">⬅️ Return to Main</a>
    </main>
  );
}
