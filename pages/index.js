import { useEffect, useState } from 'react';
import data from '../public/pokedex.json';

export default function Home() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      const starter = prompt("Choose your starter: Bulbasaur, Charmander or Squirtle");
      const starterData = data.find(p => p.name.toLowerCase() === starter.toLowerCase());
      const newGame = {
        coins: 500,
        pokeballs: 10,
        pokedex: [starterData.id],
        inventory: { [starterData.id]: 1 },
        caught: [starterData.id],
        masterballs: 0,
        greatballs: 0,
        ultraballs: 0
      };
      setGame(newGame);
      localStorage.setItem("gameState", JSON.stringify(newGame));
    } else {
      setGame(saved);
    }
  }, []);

  const search = () => {
    const wild = data[Math.floor(Math.random() * data.length)];
    alert(`A wild ${wild.name} appeared!`);
    // You'll add catching logic here later
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main>
      <h1>Pokémon Catcher</h1>
      <p>Coins: {game.coins} | Pokéballs: {game.pokeballs}</p>
      <button onClick={search}>Search for Pokémon</button>
    </main>
  );
}
