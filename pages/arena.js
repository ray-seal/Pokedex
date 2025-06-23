// pages/arena.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Arena() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
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
    if (saved) setGame(saved);
  }, []);

  // Start new battle
  useEffect(() => {
    if (data.length && game) {
      const rand = data[Math.floor(Math.random() * data.length)];
      setWild(rand);
    }
  }, [data, game]);

  const saveGame = (g) => {
    setGame(g);
    localStorage.setItem('gameState', JSON.stringify(g));
  };

  const attack = () => {
    if (!wild || battleOver) return;
    const pDmg = Math.floor(Math.random() * 30) + 10;
    const eDmg = Math.floor(Math.random() * 20) + 5;
    const newEnemy = Math.max(enemyHP - pDmg, 0);
    const newPlayer = Math.max(playerHP - eDmg, 0);
    setEnemyHP(newEnemy);
    setPlayerHP(newPlayer);
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
    inv[id] = (inv[id]||0) + 1;
    if (!pokedex.includes(id)) pokedex.push(id);
    updated.inventory = inv;
    updated.pokedex = pokedex;

    saveGame(updated);
    setMessage(`You caught ${name}!`);
    setBattleOver(false);
  };

  if (!game || !wild) return <p>Loading battle...</p>;

  return (
    <main style={{ fontFamily:'monospace', padding:20 }}>
      <h1>⚔️ Battle Arena</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>Wild {wild.name} (Stage {wild.stage}{wild.legendary ? ', Legendary':''})</p>
      <img src={wild.sprite} alt={wild.name} width="96" />
      <p>Enemy HP: {enemyHP} | Your HP: {playerHP}</p>

      {!battleOver && (
        <button onClick={attack}>Attack</button>
      )}

      {battleOver && won && (
        <div>
          <p>🏆 You defeated {wild.name}!</p>
          <button onClick={takeReward}>Take 50 coins</button>
          <button onClick={attemptCatch}>Try to Catch</button>
        </div>
      )}

      {battleOver && !won && (
        <p>You lost... better luck next time.</p>
      )}

      <br/><br/>
      <Link href="/">🏠 Back to Main</Link>
    </main>
  );
}