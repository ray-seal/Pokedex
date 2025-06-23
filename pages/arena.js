// pages/arena.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Arena() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [battleOver, setBattleOver] = useState(false);
  const [won, setWon] = useState(false);

  // Load pokedex.json
  useEffect(() => {
    fetch('/pokedex.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  // Load game state
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (saved) {
      // ensure playerHP exists in old saves
      if (saved.playerHP === undefined) saved.playerHP = 100;
      setGame(saved);
    }
  }, []);

  // Start new battle if player is alive
  useEffect(() => {
    if (data.length && game && game.playerHP > 0) {
      const rand = data[Math.floor(Math.random() * data.length)];
      setWild(rand);
      setEnemyHP(100); // reset wild HP every time
      setBattleOver(false);
      setWon(false);
    }
  }, [data, game?.playerHP]);

  const saveGame = (g) => {
    setGame(g);
    localStorage.setItem('gameState', JSON.stringify(g));
  };

  const attack = () => {
    if (!wild || battleOver || game.playerHP <= 0) return;

    const playerDmg = Math.floor(Math.random() * 30) + 10;
    const enemyDmg = Math.floor(Math.random() * 20) + 5;

    const newEnemy = Math.max(enemyHP - playerDmg, 0);
    const newPlayer = Math.max(game.playerHP - enemyDmg, 0);

    setEnemyHP(newEnemy);

    const updatedGame = { ...game, playerHP: newPlayer };
    saveGame(updatedGame);

    if (newEnemy === 0 || newPlayer === 0) {
      setBattleOver(true);
      setWon(newEnemy === 0);
    }
  };

  const takeReward = () => {
    const updated = { ...game, coins: game.coins + 50 };
    saveGame(updated);
    setBattleOver(false);
  };

  const attemptCatch = () => {
    const { id, stage, legendary, name } = wild;
    const updated = { ...game };
    const inv = { ...game.inventory };
    const pokedex = [...game.pokedex];

    const needBall =
      legendary ? 'masterballs' :
      stage === 3 ? 'ultraballs' :
      stage === 2 ? 'greatballs' :
      'pokeballs';

    if (updated[needBall] < 1) {
      alert(`You need a ${needBall.replace('balls',' Ball')} to catch ${name}!`);
      return;
    }

    updated[needBall] -= 1;
    inv[id] = (inv[id] || 0) + 1;
    if (!pokedex.includes(id)) pokedex.push(id);
    updated.inventory = inv;
    updated.pokedex = pokedex;

    saveGame(updated);
    alert(`You caught ${name}!`);
    setBattleOver(false);
  };

  if (!game || !wild) return <p>Loading arena...</p>;

  if (game.playerHP <= 0) {
    return (
      <main style={{ fontFamily: 'monospace', padding: 20 }}>
        <h1>⚔️ Battle Arena</h1>
        <p>Your Pokémon are too tired to fight.</p>
        <Link href="/center">🏥 Go to Pokémon Center</Link>
        <br />
        <Link href="/">⬅️ Back to Home</Link>
      </main>
    );
  }

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: 20,
      backgroundImage: 'url("/backgrounds/arena.jpg")',
      backgroundSize: 'cover',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>⚔️ Battle Arena</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>❤️ Your HP: {game.playerHP}</p>
      <hr />
      <p>👾 Wild {wild.name} (Stage {wild.stage}{wild.legendary ? ', Legendary' : ''})</p>
      <img src={wild.sprite} alt={wild.name} width="96" />
      <p>Enemy HP: {enemyHP}</p>

      {!battleOver && (
        <button onClick={attack}>Attack</button>
      )}

      {battleOver && won && (
        <>
          <p>🏆 You defeated {wild.name}!</p>
          <button onClick={takeReward}>Take 50 Coins</button>
          <button onClick={attemptCatch}>Try to Catch</button>
        </>
      )}

      {battleOver && !won && (
        <p>You lost the battle...</p>
      )}

      <br /><br />
      <Link href="/">🏠 Back to Main</Link>
    </main>
  );
}