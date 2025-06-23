import { useEffect, useState } from 'react';
import Battle from '../components/Battle.jsx'; // ✅ Import the Battle component

export default function Home() {
  const [data, setData] = useState([]); // pokedex data
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState('');
  const [inBattle, setInBattle] = useState(false); // ✅ New state to track battle mode

  // Fetch pokedex.json from public folder
  useEffect(() => {
    fetch('/pokedex.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Failed to load pokedex:', err));
  }, []);

  useEffect(() => {
    if (!data.length) return; // wait until pokedex is loaded
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      const starter = prompt('Choose your starter: Bulbasaur, Charmander or Squirtle');
      const starterData = data.find(p => p.name.toLowerCase() === starter?.toLowerCase());
      if (!starterData) return alert('Invalid starter. Reload to try again.');
      const newGame = {
        coins: 500,
        pokeballs: 10,
        greatballs: 0,
        ultraballs: 0,
        masterballs: 0,
        pokedex: [starterData.id],
        inventory: { [starterData.id]: 1 }
      };
      setGame(newGame);
      localStorage.setItem('gameState', JSON.stringify(newGame));
    } else {
      setGame(saved);
    }
  }, [data]);

  const saveGame = (updatedGame) => {
    setGame(updatedGame);
    localStorage.setItem('gameState', JSON.stringify(updatedGame));
  };

  const search = () => {
    const encounter = data[Math.floor(Math.random() * data.length)];
    setWild(encounter);
    setMessage(`A wild ${encounter.name} appeared!`);
    setInBattle(true); // ✅ Enter battle mode
  };

  const back = () => {
    setInBattle(false);
    setWild(null);
    setMessage('');
  };

  if (!data.length || !game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🎮 Pokémon Catcher</h1>
      <p>💰 Coins: {game.coins}</p>
      <p>
        🎯 Pokéballs: {game.pokeballs} | Great: {game.greatballs} | Ultra: {game.ultraballs} | Master: {game.masterballs}
      </p>

      {!inBattle && (
        <>
          <button onClick={search}>🔍 Search for Pokémon</button>
          {message && <p style={{ marginTop: '10px' }}>{message}</p>}
        </>
      )}

      {inBattle && wild && (
        <Battle
          wild={wild}
          game={game}
          setGame={saveGame}
          back={back}
        />
      )}

      {!inBattle && (
        <>
          <hr style={{ marginTop: '30px' }} />
          <h2>📘 Pokédex</h2>
          <ul>
            {game.pokedex.sort((a, b) => a - b).map(id => {
              const p = data.find(mon => mon.id === id);
              return (
                <li key={id}>
                  <img src={p.sprite} alt={p.name} width="32" /> {p.name} ×{game.inventory[id]}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
