import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState([]);
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/pokedex.json')
      .then(r => r.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (!data.length) return;
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      const starter = prompt('Choose Bulbasaur, Charmander or Squirtle:');
      const sd = data.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!sd) return alert('Invalid starter!');
      const newGame = {
        coins: 500,
        pokeballs: 10,
        greatballs: 0,
        ultraballs: 0,
        masterballs: 0,
        pokedex: [sd.id],
        inventory: { [sd.id]: 1 },
        playerHP: 100
      };
      localStorage.setItem('gameState', JSON.stringify(newGame));
      setGame(newGame);
    } else {
      setGame(saved);
    }
  }, [data]);

  const save = g => {
    setGame(g);
    localStorage.setItem('gameState', JSON.stringify(g));
  };

  const search = () => {
    const rnd = data[Math.floor(Math.random() * data.length)];
    setWild(rnd);
    setMessage(`A wild ${rnd.name} appeared!`);
  };

  const tryCatch = ball => {
    if (!wild) return;
    const { id, name, stage, legendary } = wild;
    const g = { ...game };
    const inv = { ...g.inventory };
    const pdex = [...g.pokedex];
    const count = inv[id] || 0;

    if (ball === 'pokeballs') {
      if (stage !== 1) return setMessage(`${name} resists a Pokéball!`);
      if (g.pokeballs < 1) return setMessage('No Pokéballs left!');
      g.pokeballs--;
    } else if (ball === 'greatballs') {
      if (stage > 2) return setMessage(`${name} resists a Great Ball!`);
      if (g.greatballs < 1) return setMessage('No Great Balls left!');
      g.greatballs--;
    } else if (ball === 'ultraballs') {
      if (legendary) return setMessage(`${name} resists an Ultra Ball!`);
      if (g.ultraballs < 1) return setMessage('No Ultra Balls left!');
      g.ultraballs--;
    } else if (ball === 'masterballs') {
      if (!legendary) return setMessage(`Save Master Balls for legendaries!`);
      if (g.masterballs < 1) return setMessage('No Master Balls left!');
      g.masterballs--;
    }

    inv[id] = count + 1;
    if (!pdex.includes(id)) pdex.push(id);
    g.inventory = inv;
    g.pokedex = pdex;

    save(g);
    setMessage(`🎉 You caught ${name}!`);
    setWild(null);
  };

  if (!game || !data.length) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily:'monospace', padding:20 }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins} | HP: {game.playerHP}</p>
      <p>
        🎯 Pokéballs: {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}
      </p>

      <button onClick={search}>🔍 Search for Pokémon</button>

      {wild && (
        <div style={{ marginTop:20 }}>
          <h2>A wild {wild.name} appears!</h2>
          <img src={wild.sprite} alt={wild.name} width="64" />
          <div>
            <button onClick={() => tryCatch('pokeballs')}>Pokéball</button>
            <button onClick={() => tryCatch('greatballs')}>Great Ball</button>
            <button onClick={() => tryCatch('ultraballs')}>Ultra Ball</button>
            <button onClick={() => tryCatch('masterballs')}>Master Ball</button>
          </div>
        </div>
      )}

      {message && <p style={{ marginTop:10 }}>{message}</p>}

      <hr />
      <h2>📘 Pokédex</h2>
      <ul>
        {game.pokedex.sort((a,b)=>a-b).map(id => {
          const p = data.find(mon => mon.id === id);
          return (
            <li key={id}>
              <img src={p.sprite} alt={p.name} width="32" /> {p.name} ×{game.inventory[id]}
            </li>
          );
        })}
      </ul>

      <br />
      <Link href="/store">🛍️ Store</Link><br />
      <Link href="/lab">🧪 Lab</Link><br />
      <Link href="/arena">⚔️ Arena</Link><br />
      <Link href="/center">🏥 Center</Link>
    </main>
  );
}
