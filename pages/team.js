import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';

export default function TeamBuilder() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) {
      alert("No save found. Returning to home.");
      router.push('/');
    } else {
      setGame(saved);
      setTeam(saved.team || []);
    }
  }, []);

  const handleSelect = (id) => {
    const isSelected = team.find(p => p.id === id);

    if (isSelected) {
      setTeam(prev => prev.filter(p => p.id !== id));
    } else if (team.length < 6) {
      const poke = pokedex.find(p => p.id === id);
      setTeam(prev => [...prev, { ...poke, hp: 100 }]);
    } else {
      alert("You can only choose up to 6 Pokémon.");
    }
  };

  const saveTeam = () => {
    const updated = { ...game, team };
    localStorage.setItem("gameState", JSON.stringify(updated));
    router.push('/arena');
  };

  if (!game) return <p>Loading team builder...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🧩 Build Your Team</h1>
      <p>Select up to 6 Pokémon:</p>
      <ul>
        {game.pokedex.map(id => {
          const p = pokedex.find(mon => mon.id === id);
          const selected = !!team.find(t => t.id === id);

          return (
            <li key={id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleSelect(id)}
                />
                <img src={p.sprite} alt={p.name} width="32" /> {p.name}
              </label>
            </li>
          );
        })}
      </ul>

      <button onClick={saveTeam}>✅ Save Team and Go to Arena</button>
    </main>
  );
}
