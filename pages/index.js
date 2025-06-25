import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Home() {
  const [game, setGame] = useState(null);
  const [wildPokemon, setWildPokemon] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || !saved.team || saved.team.length === 0) {
      router.push('/team'); // force team selection if not set
      return;
    }
    setGame(saved);
  }, []);

  function getMaxHP(mon) {
    return getPokemonStats(mon).hp;
  }

  function searchLongGrass() {
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    setWildPokemon(wild);
    setMessage(`A wild ${wild.name} appeared in the long grass!`);
  }

  if (!game) return <p>Loading...</p>;

  return (
    <main
      style={{
        fontFamily: 'monospace',
        minHeight: '100vh',
        background: 'url("/main-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        color: 'white',
        padding: 0,
        margin: 0,
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{marginTop: 32}}>Pokémon Adventure</h1>
      <h2>Your Team</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {game.team.map((mon) => (
          <div key={mon.id}
            style={{
              border: '2px solid #fff',
              borderRadius: 12,
              background: mon.hp > 0 ? 'rgba(255,255,255,0.12)' : 'rgba(200,50,50,0.17)',
              padding: 12,
              minWidth: 95,
              textAlign: 'center'
            }}>
            <img src={mon.sprite} alt={mon.name} width="48" /><br />
            <strong>{mon.name}</strong><br />
            HP: {mon.hp} / {getMaxHP(mon)}
          </div>
        ))}
      </div>

      <button className="poke-button" onClick={searchLongGrass} style={{margin: '12px 0 18px 0', fontWeight: 'bold', fontSize: '1.08rem'}}>
        🌾 Search Long Grass
      </button>
      {wildPokemon && (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
          <img src={wildPokemon.sprite} alt={wildPokemon.name} width="96" />
          {/* Pokéball overlay if already in pokedex */}
          {game.pokedex && game.pokedex.includes(wildPokemon.id) && (
            <img
              src="/pokeball.png"
              alt="Caught"
              width="28"
              style={{
                position: 'absolute',
                left: 60, // adjust if needed for your sprites
                bottom: 10,
                pointerEvents: 'none'
              }}
            />
          )}
          <br />
          <b>{wildPokemon.name}</b>
        </div>
      )}
      <p style={{minHeight: 32}}>{message}</p>

      <div style={{
        position: 'fixed',
        bottom: 24,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
        zIndex: 100
      }}>
        <button className="poke-button" onClick={() => router.push('/store')}>🛒 Pokemart</button>
        <button className="poke-button" onClick={() => router.push('/lab')}>🧑‍🔬 Professor Oak's Lab</button>
        <button className="poke-button" onClick={() => router.push('/center')}>🏥 Pokémon Center</button>
        <button className="poke-button" onClick={() => router.push('/arena')}>🏟️ Pokémon Arena</button>
        <button className="poke-button" onClick={() => router.push('/pokedex')}>📖 Pokédex</button>
        <button className="poke-button" onClick={() => router.push('/team')}>🧑‍🤝‍🧑 Choose Team</button>
      </div>

      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 10px 18px;
          border-radius: 7px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.09);
          margin: 6px 0;
          cursor: pointer;
          color: #222;
          text-decoration: none;
          font-family: inherit;
          font-size: 1rem;
          display: inline-block;
          transition: background 0.18s, border 0.18s;
        }
        .poke-button:hover {
          background: #e0e0e0;
          border-color: #888;
        }
      `}</style>
    </main>
  );
}
