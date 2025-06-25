import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Center() {
  const [healed, setHealed] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px', minHeight: '100vh', backgroundColor: '#f0fff0' }}>
      <h1>🏥 Pokémon Center</h1>
      {healed ? (
        <p>Your team is fully healed!</p>
      ) : (
        <p>Healing your Pokémon...</p>
      )}
      <br />
      <button onClick={() => router.push("/")}>⬅️ Return Home</button>
    </main>
  );
}
