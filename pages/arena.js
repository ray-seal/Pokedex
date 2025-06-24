import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Arena({ pokedex }) {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [battleOver, setBattleOver] = useState(false);
  const [won, setWon] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || saved.playerHP <= 0) return router.push('/');
    setGame(saved);
  }, []);

  useEffect(() => {
    if (game && (!wild || battleOver)) {
      const rnd = pokedex[Math.floor(Math.random()*pokedex.length)];
      setWild(rnd);
      setEnemyHP(100);
      setBattleOver(false);
      setWon(false);
    }
  }, [game, battleOver]);

  const save = g => {
    setGame(g);
    localStorage.setItem('gameState', JSON.stringify(g));
  };

  const attack = () => {
    if (!wild || battleOver || game.playerHP <= 0) return;
    const dmgP = Math.floor(Math.random()*30)+10;
    const dmgW = Math.floor(Math.random()*20)+5;
    const newE = Math.max(0, enemyHP - dmgP);
    const newP = Math.max(0, game.playerHP - dmgW);
    setEnemyHP(newE);
    const ng = {...game, playerHP:newP};
    save(ng);
    if (newP <= 0) { setBattleOver(true); setWon(false); }
    else if (newE <= 0) { setBattleOver(true); setWon(true); }
  };

  const claim = () => save({ ...game, coins: game.coins + 50 });
  const attemptCatch = () => {
    const { id, stage, legendary, name } = wild;
    const ng = { ...game };
    const inv = {...ng.inventory};
    const pdex = [...ng.pokedex];
    const findBall = legendary && ng.masterballs > 0 ? 'masterballs'
      : stage ===3 && ng.ultraballs>0 ? 'ultraballs'
      : stage===2 && ng.greatballs>0 ? 'greatballs'
      : stage===1 && ng.pokeballs>0 ? 'pokeballs' : null;
    if (!findBall) return alert('No suitable ball!');
    ng[findBall]--;
    inv[id] = (inv[id]||0)+1;
    if (!pdex.includes(id)) pdex.push(id);
    ng.inventory = inv; ng.pokedex = pdex;
    save(ng);
    alert(`Caught ${name}!`);
    setBattleOver(true);
  };

  if (!game || !wild) return <p>Loading Arena…</p>;

  return (
    <main style={{ fontFamily:'monospace', padding:20 }}>
      <h1>⚔️ Battle Arena</h1>
      <p>👤 HP: {game.playerHP} | 🐾 Wild: {wild.name} (HP: {enemyHP})</p>
      <img src={wild.sprite} width="64"/><br/>

      {!battleOver && <button onClick={attack}>Attack</button>}

      {battleOver && won ? (
        <>
          <p>You defeated {wild.name}!</p>
          <button onClick={claim}>Take 50 coins</button>
          <button onClick={attemptCatch}>Try Catch</button>
        </>
      ) : battleOver && !won ? (
        <p>You fainted! Heal at Center 🏥</p>
      ) : null}

      <br/><Link href="/">⬅️ Back Home</Link>
    </main>
  );
}

export function getStaticProps() {
  const pokedex = require('../public/pokedex.json');
  return { props: { pokedex } };
}
