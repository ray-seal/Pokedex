import { useEffect, useState } from 'react';
import Store from './components/Store';
import Pokedex from './components/Pokedex';
import Catch from './components/Catch';
import Lab from './components/Lab';

export default function App() {
  const [game, setGame] = useState(null);
  const [view, setView] = useState('main');

  // Load saved game from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      setGame(JSON.parse(saved));
    } else {
      setGame({
        coins: 500,
        pokeballs: 10,
        greatballs: 0,
        ultraballs: 0,
        masterballs: 0,
        berries: 0,
        caught: [],
        starter: null
      });
    }
  }, []);

  // Save game to localStorage whenever it changes
  useEffect(() => {
    if (game) {
      localStorage.setItem('gameState', JSON.stringify(game));
    }
  }, [game]);

  // Reset game completely
  const resetGame = () => {
    localStorage.removeItem('gameState');
    window.location.reload();
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>Pokémon Catcher</h1>
      <p>Coins: {game.coins}</p>
      <p>
        Pokéballs: {game.pokeballs} | Great Balls: {game.greatballs} | Ultra Balls: {game.ultraballs} | Master Balls: {game.masterballs}
      </p>
      <p>Berries: {game.berries}</p>
      <p>Pokédex Progress: {game.caught.length} / 151</p>

      {view === 'main' && (
        <>
          <button onClick={() => setView('catch')}>🔍 Search for Pokémon</button>
          <button onClick={() => setView('pokedex')}>📖 View Pokédex</button>
          <button onClick={() => setView('store')}>🏪 Visit Store</button>
          <button onClick={() => setView('lab')}>🔬 Professor Oak’s Lab</button>
          <button onClick={resetGame}>🗑️ Reset Game</button>
        </>
      )}

      {view === 'catch' && (
        <Catch game={game} setGame={setGame} back={() => setView('main')} />
      )}
      {view === 'pokedex' && (
        <Pokedex game={game} back={() => setView('main')} />
      )}
      {view === 'store' && (
        <Store game={game} setGame={setGame} back={() => setView('main')} />
      )}
      {view === 'lab' && (
        <Lab game={game} setGame={setGame} back={() => setView('main')} />
      )}
    </div>
  );
}
