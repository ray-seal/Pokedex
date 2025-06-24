import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import data from '../public/pokedex.json';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState("");
  const [playerHP, setPlayerHP] = useState(100);
  const [wildHP, setWildHP] = useState(100);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved || !saved.team || saved.team.length === 0) {
      alert("No team selected. Go to Team page first.");
      router.push('/');
      return;
    }
    setGame(saved);
    setPlayerHP(saved.team[0].hp ?? 100);
    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setWildHP(100);
  }, []);

  const attack = () => {
    if (!game || !wild) return;
    const newWildHP = wildHP - 25;
    if (newWildHP <= 0) {
      setMessage(`You defeated ${wild.name}!`);
    } else {
      setWildHP(newWildHP);
      const newPlayerHP = playerHP - 20;
      if (newPlayerHP <= 0) {
        setMessage("You fainted! Visit the Pokémon Center.");
        setPlayerHP(0);
      } else {
        setPlayerHP(newPlayerHP);
      }
    }
  };

  const run = () => {
    const newWild = data[Math.floor(Math.random() * data.length)];
    setWild(newWild);
    setWildHP(100);
    setMessage("You ran into another Pokémon!");
  };

  const healAndReturn = () => {
    if (!game) return;
    const healed = {
      ...game,
      team: game.team.map(p => ({ ...p, hp: 100 }))
    };
    localStorage.setItem("gameState", JSON.stringify(healed));
    setGame(healed);
    router.push('/');
  };

  if (!game || !wild || !game.team) return <p>Loading Arena...</p>;

  const activePokemon = game.team[activeIndex];

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px', minHeight: '100vh', background: '#fafafa' }}>
      <h1>🏟️ Arena</h1>
      <p>🎮 Your Pokémon: {activePokemon?.name} | HP: {playerHP}</p>
      <p>👾 Wild Pokémon: {wild?.name} | HP: {wildHP}</p>

      <button onClick={attack} disabled={playerHP <= 0 || wildHP <= 0}>⚔️ Attack</button>
      <button onClick={run}>🏃 Run
