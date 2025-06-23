import React, { useState, useEffect } from 'react';
import data from '../public/pokedex.js';

function Battle({ game, setGame, back }) {
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setEnemyHP(100);
    setPlayerHP(100);
    setMessage(`A wild ${random.name} appeared!`);
  }, []);

  const attack = () => {
    if (!wild) return;

    const playerDmg = Math.floor(Math.random() * 30) + 10;
    const wildDmg = Math.floor(Math.random() * 20) + 5;

    const newEnemyHP = Math.max(enemyHP - playerDmg, 0);
    const newPlayerHP = Math.max(playerHP - wildDmg, 0);

    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);

    if (newEnemyHP === 0) {
      setMessage(`You defeated ${wild.name}! +50 coins`);
      const updated = { ...game, coins: game.coins + 50 };
      setGame(updated);
      localStorage.setItem("gameState", JSON.stringify(updated));
    } else if (newPlayerHP === 0) {
      setMessage(`${wild.name} defeated you! Better luck next time.`);
    } else {
      setMessage(`You dealt ${playerDmg}. ${wild.name} dealt ${wildDmg}.`);
    }
  };

  const nextBattle = () => {
    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setEnemyHP(100);
    setPlayerHP(100);
    setMessage(`A wild ${random.name} appeared!`);
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: 20 }}>
      {wild && (
        <>
          <h2>⚔️ Wild Battle</h2>
          <p><strong>{wild.name}</strong></p>
          <img src={wild.sprite} alt={wild.name} width="96" height="96" />
          <p>Enemy HP: {enemyHP} / 100</p>
          <p>Your HP: {playerHP} / 100</p>
          <p>{message}</p>
        </>
      )}

      {enemyHP > 0 && playerHP > 0 ? (
        <>
          <button onClick={attack}>Attack</button>{' '}
          <button onClick={back}>Run Away</button>
        </>
      ) : (
        <>
          <button onClick={nextBattle}>Next Battle</button>{' '}
          <button onClick={back}>Back to Main</button>
        </>
      )}
    </div>
  );
}

// Export as named export for index.js re-export compatibility
export { Battle };
