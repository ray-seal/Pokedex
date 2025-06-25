import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Center() {
  const [healed, setHealed] = useState(false);
  const [healing, setHealing] = useState(false);
  const router = useRouter();

  const handleHeal = () => {
    setHealing(true);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem("gameState"));
      if (saved && saved.team) {
        // Heal each Pokémon to their real maximum HP
        saved.team = saved.team.map(p => {
          const pokedexEntry = pokedex.find(mon => mon.id === p.id);
          const stats = pokedexEntry ? getPokemonStats(pokedexEntry) : { hp: 100 };
          return { ...p, hp: stats.hp };
        });
        localStorage.setItem("gameState", JSON.stringify(saved));
        setHealed(true);
      }
      setHealing(false);
    }, 900); // Simulate healing animation
  };

  const handleUsePC = () => {
    router.push('/team');
  };

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px', minHeight: '100vh', backgroundColor: '#f0fff0' }}>
      <h1>🏥 Pokémon Center</h1>
      {healed ? (
        <p>Your team is fully healed!</p>
      ) : healing ? (
        <p>Healing your Pokémon...</p>
      ) : (
        <>
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
          <button
            onClick={handleUsePC}
            style={{
              background: "#fff",
              border: "1px solid #bbb",
              borderRadius: 7,
              padding: "10px 20px",
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            💾 Use PC (Choose Team)
          </button>
        </>
      )}
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
