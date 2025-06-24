import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Home() {
  const [game, setGame] = useState(null); // state for user game data
  const [wildPokemon, setWildPokemon] = useState(null); // current wild pokemon
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Load game state from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      router.push('/setup'); // Or any setup page you use
      return;
    }
    setGame(saved);
  }, []);

  // Helper for max HP (optional, for display)
  function getMaxHP(mon) {
    if (!mon) return 0;
    return getPokemonStats(mon).hp;
  }

  // Find new wild Pokémon
  function searchWild() {
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    const stats = getPokemonStats(wild);
    setWildPokemon({ ...wild, hp: stats.hp });
    setMessage(`A wild ${wild.name} appeared!`);
  }

  // Example: Add wild Pokémon to pokedex
  function addToPokedex(pokemon) {
    if (!game) return;
    if (game.pokedex.includes(pokemon.id)) {
      setMessage(`${pokemon.name} is already in your Pokédex!`);
      return;
    }
    const updated = { ...game, pokedex: [...game.pokedex, pokemon.id] };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage(`${pokemon.name} added to your Pokédex!`);
  }

  if (!game) return <p>Loading...</p>;

  return (
    <main
      style={{
        fontFamily: 'monospace',
        padding: 20,
        background: 'url("/arena-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        color: 'white',
        minHeight: '100vh',
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
      }}
    >
      <h1>Pokédex Home</h1>
      <button className="poke-button" onClick={searchWild}>
        Search for Wild Pokémon
      </button>
      <br /><br />

      {wildPokemon && (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <img src={wildPokemon.sprite} alt={wildPokemon.name} width="96" />
          {/* Pokéball if already caught */}
          {game.pokedex.includes(wildPokemon.id) && (
            <img
              src="/pokeball.png"
              alt="Caught"
              width="28"
              style={{
                position: 'absolute',
                left: 64, // adjust as needed
                bottom: 10,
                pointerEvents: 'none'
              }}
            />
          )}
          <br />
          <b>{wildPokemon.name}</b> (HP: {wildPokemon.hp} / {getMaxHP(wildPokemon)})
          <div>
            <button
              className="poke-button"
              onClick={() => addToPokedex(wildPokemon)}
              disabled={game.pokedex.includes(wildPokemon.id)}
              style={{ marginTop: 8 }}
            >
              {game.pokedex.includes(wildPokemon.id) ? 'Already in Pokédex' : 'Add to Pokédex'}
            </button>
          </div>
        </div>
      )}

      <p>{message}</p>

      <button className="poke-button" onClick={() => router.push('/arena')}>
        🏟️ Go to Arena
      </button>
      <button className="poke-button" onClick={() => router.push('/center')} style={{ marginLeft: 10 }}>
        🏥 Go to Pokémon Center
      </button>

      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 10px 20px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          margin: 6px 8px 6px 0;
          cursor: pointer;
          color: #222;
          text-decoration: none;
          font-family: inherit;
          font-size: 1rem;
          display: inline-block;
          transition: background 0.2s, border 0.2s;
        }
        .poke-button:hover {
          background: #e0e0e0;
          border-color: #888;
        }
      `}</style>
    </main>
  );
}
