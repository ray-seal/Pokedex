import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home({ pokedex }) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      const starter = prompt('Choose Bulbasaur, Charmander or Squirtle');
      const sd = pokedex.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!sd) return alert('Invalid starter.');
      const ng = { coins:500, pokeballs:10, greatballs:0, ultraballs:0, masterballs:0, pokedex:[sd.id], inventory:{[sd.id]:1}, playerHP:100 };
      localStorage.setItem('gameState', JSON.stringify(ng));
      setGame(ng);
    } else setGame(saved);
  }, [pokedex]);

  if (!game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily:'monospace', padding:20 }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins} | ❤️ HP: {game.playerHP}</p>
      <p>🎯 Pokéball(s): {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}</p>
      <br/>
      <Link href="/arena">⚔️ Enter Arena</Link><br/>
      <Link href="/store">🛍️ Store</Link><br/>
      <Link href="/lab">🧪 Lab</Link><br/>
      <Link href="/center">🏥 Center</Link><br/>

      <h2>📘 Pokédex</h2>
      <ul>
        {game.pokedex.sort((a,b)=>a-b).map(id => {
          const p = pokedex.find(x => x.id === id);
          return <li key={id}>
            <img src={p.sprite} width="32" /> {p.name} ×{game.inventory[id]}
          </li>;
        })}
      </ul>
    </main>
  );
}

export async function getStaticProps() {
  const pokedex = require('../public/pokedex.json');
  return { props: { pokedex } };
}
