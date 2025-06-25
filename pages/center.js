import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Center() {
  const [healed, setHealed] = useState(false);
  const [healing, setHealing] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Defensive check for valid team in localStorage
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("gameState"));
    } catch (e) {
      saved = null;
    }
    if (saved && Array.isArray(saved.team) && saved.team.length > 0) {
      setHasTeam(true);
    } else {
      setHasTeam(false);
    }
  }, []);

  const handleHeal = () => {
    setHealing(true);
    setTimeout(() => {
      let saved = null;
      try {
        saved = JSON.parse(localStorage.getItem("gameState"));
      } catch (e) {
        saved = null;
      }
      if (saved && Array.isArray(saved.team) && saved.team.length > 0) {
        saved.team = saved.team.map(p => {
          const pokedexEntry = pokedex.find(mon => mon.id === p.id);
          const stats = pokedexEntry ? getPokemonStats(pokedexEntry) : { hp: 100 };
          return { ...p, hp: stats.hp, maxhp: stats.hp };
        });
        localStorage.setItem("gameState", JSON.stringify(saved));
        setHealed(true);
      }
      setHealing(false);
    }, 900); // Simulate healing animation
  };

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: '20px',
      minHeight: '100vh',
      background: 'url("/center-bg.jpg") no-repeat center center',
      backgroundSize: 'cover',
      position: 'relative'
    }}>
      <h1>🏥 Pokémon Center</h1>
      {!hasTeam && (
        <p style={{ color: '#b00', fontWeight: 'bold' }}>No Pokémon team found. Please add Pokémon to your team first.</p>
      )}
      {hasTeam && healed ? (
        <p>Your team is fully healed!</p>
      ) : hasTeam && healing ? (
        <p>Healing your Pokémon...</p>
      ) : hasTeam ? (
        <button
          onClick={handleHeal}
          style={{
            background: "#fff",
            border: "1px solid #bbb",
            borderRadius: 7,
            padding: "10px 20px",
            marginRight: 14,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          ✨ Heal your Pokémon
        </button>
      ) : null}
      <br /><br />
      <button
        onClick={() => router.push("/")}
        style={{
          background: "#f9f9f9",
          border: "1px solid #bbb",
          borderRadius: 7,
          padding: "8px 16px",
          cursor: "pointer",
          fontFamily: "inherit"
        }}
      >⬅️ Return Home</button>
    </main>
  );
}
