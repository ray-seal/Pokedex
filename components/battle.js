import React, { useState, useEffect } from 'react';
import pokedex from '../public/pokedex.json';

export default function Battle({ game, setGame, back }) {
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [message, setMessage] = useState('');
  const [playerHP, setPlayerHP] = useState(100);

  useEffect(() => {
    const random = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWild(random);
    setEnemyHP(100);
    setPlayerHP(100);
    setMessage(`A wild ${random.name} appeared!`);
  }, []);

  const attack = () => {
    if (!wild) return;
    const playerDmg = Math.floor(Math.random() * 30) + 10;
    const enemyDmg = Math.floor(Math.random() * 20) + 5;

    let newEnemyHP = Math.max(enemyHP - playerDmg, 0);
    let newPlayerHP = Math.max(playerHP - enemyDmg, 0);

    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);

    if (newEnemyHP === 0) {
      setMessage(`You defeated ${wild.name}! +50 coins`);
      setGame({ ...game, coins: game.coins + 50 });
    } else if (newPlayerHP === 0) {
      setMessage(`${wild.name} defeated you! No reward.`);
    } else {
      setMessage(`You dealt ${playerDmg} damage. ${wild.name} hit back for ${enemyDmg}.`);
    }
  };

  const nextBattle = () => {
    const random = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWild(random);
    setEnemyHP(100);
    setPlayerHP(100);
    setMessage(`A wild ${random.name} appeared!`);
  };

  const runAway = () => {
    setMessage('You ran away safely.');
    setTimeout(() => back(), 1000);
  };

  return (
    <div>
      <h2>⚔️ Battle Mode</h2>
      {wild && (
        <>
          <h3>Wild {wild.name}</h3>
          <img src={wild.sprite} alt={wild.name} width="96" height="96" />
          <p><strong>Enemy HP:</strong> {enemyHP}</p>
          <p><strong>Your HP:</strong> {playerHP}</p>
        </>
      )}
      <p>{message}</p>

      {enemyHP > 0 && playerHP > 0 && (
        <>
          <button onClick={attack}>Attack</button>
          <button onClick={runAway}>Run</button>
        </>
      )}

      {(enemyHP === 0 || playerHP === 0) && (
        <>
          <button onClick={nextBattle}>Next Battle</button>
          <button onClick={back}>Back to Main</button>
        </>
      )}
    </div>
  );
}
