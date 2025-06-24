import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import Link from 'next/link';
import { getPokemonStats } from '../lib/pokemonStats';

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
      setTeam((saved.team || []).slice(0, 6));
    }
  }, []);

  const handleSelect = (id) => {
    const isSelected = team.find(p => p.id === id);

    if (isSelected) {
      setTeam(prev => prev.filter(p => p.id !== id));
    } else if (team.length < 6) {
      const poke = pokedex.find(p => p.id === id);
      const stats = getPokemonStats(poke);
      setTeam(prev => [...prev, { ...poke, hp: stats.hp }]);
    } else {
      alert("You can only choose up to 6 Pokémon.");
    }
  };

  const saveTeam = () => {
    const updated = { ...game, team };
    localStorage.setItem("gameState", JSON.stringify(updated));
    router.push('/arena');
  };

  const resetTeam = () => {
    setTeam([]);
    if (game) {
      const updated = { ...game, team: [] };
      localStorage.setItem("gameState", JSON.stringify(updated));
    }
  };

  if (!game) return <p>Loading team builder...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🧩 Build Your Team</h1>
      <p>Select up to 6 Pokémon:</p>
      <ul>
        {pokedex
          .filter(mon => game.pokedex.includes(mon.id))
          .map(mon => {
            const selected = !!team.find(t => t.id === mon.id);
            return (
              <li key={mon.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleSelect(mon.id)}
                  />
                  <img src={mon.sprite} alt={mon.name} width="32" /> {mon.name}
                </label>
              </li>
            );
          })}
      </ul>
      <button onClick={resetTeam} style={{ marginRight: '10px' }}>🗑️ Reset Team</button>
      <button onClick={saveTeam}>✅ Save Team and Go to Arena</button>
      <Link href="/">
        <a className="poke-button" style={{ marginTop: '15px', display: 'inline-block' }}>🏠 Back to Home Page</a>
      </Link>
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
         

