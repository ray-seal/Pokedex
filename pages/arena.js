import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Arena() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [battleOver, setBattleOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    fetch('/pokedex.json')
      .then(r => r.json()).then(setData);
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (saved) setGame(saved);
  }, []);

  useEffect(() => {
    if (data.length && game) {
      if (game.playerHP > 0) {
        const rnd = data[Math.floor(Math.random() * data.length)];
        setWild(rnd);
        setEnemyHP(100);
        setBattleOver(false);
        setWon(false);
      }
    }
  }, [data, game?.playerHP]);

  const save = g => {
    setGame(g);
    localStorage.setItem('gameState', JSON.stringify(g));
  };

  const attack = () => {
    if (!wild || battleOver || game.playerHP <= 0) return;
    const pD = Math.floor(Math.random()*30)+10;
    const eD = Math.floor(Math.random()*20)+5;
    const newE = Math.max(enemyHP - pD,0);
    const newP = Math.max(game.playerHP - eD,0);
    setEnemyHP(newE);
    const g = { ...game, playerHP: newP };
    save(g);
    if (newE === 0 || newP === 0) {
      setBattleOver(true);
      setWon(newE === 0);
    }
  };

  const takeReward = () => {
    const g = { ...game, coins: game.coins + 50 };
    save(g);
    setBattleOver(false);
  };

  const attemptCatch = () => {
    const { id, stage, legendary, name } = wild;
    const g = { ...game };
    const inv = { ...g.inventory };
    const pdex = [...g.pokedex];
    const need = legendary ? 'masterballs' :
                 stage === 3 ? 'ultraballs' :
                 stage === 2 ? 'greatballs' :
                 'pokeballs';
    if (g[need] < 1) return alert(`You need a ${need.replace('balls',' Ball')}!`);
    g[need]--;
    inv[id] = (inv[id]||0) + 1;
    if (!pdex.includes(id)) pdex.push(id);
    g.inventory = inv;
    g.pokedex = pdex;
    save(g);
    alert(`You caught ${name}!`);
    setBattleOver(false);
  };

  if (!game || !wild) return <p>Loading Arena...</p>;

  if (game.playerHP <= 0) {
    return (
      <main style={{ fontFamily:'monospace', padding:20 }}>
        <h1>⚔️ Battle Arena</h1>
        <p>Your Pokémon need healing.</p>
        <Link href="/center">🏥 Go to Center</Link><br />
        <Link href="/">⬅️ Home</Link>
      </main>
    );
  }

  return (
    <main style={{ fontFamily:'monospace', padding:20 }}>
      <h1>⚔️ Battle Arena</h1>
      <p>💰 Coins: {game.coins} | ❤️ HP: {game.playerHP}</p>
      <hr />
      <p>A wild {wild.name} (Stage {wild.stage}{wild.legendary? ', Legendary':''})</p>
      <img src={wild.sprite} alt={wild.name} width="96" />
      <p>Enemy HP: {enemyHP}</p>

      {!battleOver ? (
        <button onClick={attack}>Attack</button>
      ) : won ? (
        <>
          <p>You defeated {wild.name}!</p>
          <button onClick={takeReward}>Take 50 Coins</button>
          <button onClick={attemptCatch}>Try to Catch</button>
        </>
      ) : (
        <p>You lost the battle...</p>
      )}

      <br/><br/>
      <Link href="/">🏠 Home</Link>
    </main>
  );
}
