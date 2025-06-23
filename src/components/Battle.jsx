import React, { useState, useEffect, useRef } from 'react';
import pokedex from '/pokedex.json';

export default function Battle({ game, setGame, back, wild: propWild, setWild: setParentWild }) {
  const [wild, setWild] = useState(propWild || null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
  const [message, setMessage] = useState('');
  const hasEnded = useRef(false);

  useEffect(() => {
    const spawn = () => {
      const random = pokedex[Math.floor(Math.random() * pokedex.length)];
      setWild(random);
      setEnemyHP(100);
      setPlayerHP(100);
      setMessage(`A wild ${random.name} appeared!`);
      if (setParentWild) setParentWild(random);
      hasEnded.current = false;
    };

    if (propWild) {
      setWild(propWild);
      setEnemyHP(100);
      setPlayerHP(100);
      setMessage(`A wild ${propWild.name} appeared!`);
      hasEnded.current = false;
    } else {
      spawn();
    }
  }, [propWild, setParentWild]);

  const attack = () => {
    if (!wild || hasEnded.current) return;

    const playerDmg = Math.floor(Math.random() * 30) + 10;
    const wildDmg = Math.floor(Math.random() * 20) + 5;

    const newEnemyHP = Math.max(enemyHP - playerDmg, 0);
    const newPlayerHP = Math.max(playerHP - wildDmg, 0);

    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);

    if (newEnemyHP === 0) {
      setMessage(`You defeated ${wild.name}! +50 coins`);
      if (!hasEnded.current) {
        hasEnded.current = true;
        const updated = { ...game, coins: game.coins + 50 };
        setGame(updated);
        localStorage.setItem('gameState', JSON.stringify(updated));
      }
    } else if (newPlayerHP === 0) {
      setMessage(`${wild.name} defeated you! Better luck next time.`);
      hasEnded.current = true;
    } else {
      setMessage(`You dealt ${playerDmg} damage. ${wild.name} dealt ${wildDmg} damage.`);
    }
  };

  const nextBattle = () => {
    const random = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWild(random);
    if (setParentWild) setParentWild(random);
    setEnemyHP(100);
    setPlayerHP(100);
    setMessage(`A wild ${random.name} appeared!`);
    hasEnded.current = false;
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
