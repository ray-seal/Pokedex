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
      alert("No team selected. Please build a team first.");
      router.push('/');
      return;
    }

    setGame(saved);
    setPlayerHP(saved.team[0]?.hp ?? 100);

    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setWildHP(100);
  }, []);

  const attack = () => {
    if (!wild || !game) return;
    const newWildHP = wildHP - 25;

    if (newWildHP <= 0) {
      setMessage(`You defeated ${wild.name}! Choose your reward.`);
    } else {
      setWildHP(newWildHP);
      const newPlayerHP = playerHP - 20;

      if (newPlayerHP <= 0) {
        setPlayerHP(0);
        setMessage("Your Pokémon fainted! Visit the Center.");
      } else {
        setPlayerHP(newPlayerHP);
      }
    }
  };

  const run = () => {
    const random = data[Math.floor(Math.random() * data.length)];
    setWild(random);
    setWildHP(100);
    setMessage("You fled! A new wild Pokémon appears.");
  };

  const healAndReturn = () => {
    const healed = {
      ...game,
      team: game.team.map(p => ({ ...p, hp: 100 }))
    };
    localStorage.setItem("gameState", JSON.stringify(healed));
    setGame(healed);
    router.push('/');
  };

  if (!game || !wild || !game.team || !game.team[activeIndex]) {
    return <main><p>Loading battle...</p></main>;
  }

  const activePokemon = game.team[activeIndex];

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🏟️ Arena</h1>

      <p>🎮 Your Pokémon: {activePokemon.name} | HP: {playerHP}</p>
      <p>👾 Wild Pokémon: {wild.name} | HP: {wildHP}</p>

      <button onClick={attack} disabled={playerHP <= 0 || wildHP <= 0}>⚔️ Attack</button>
      <button onClick={run}>🏃 Run</button>
  {message.includes("defeated") && wildHP <= 0 && (
  <div style={{ marginTop: '20px' }}>
    <p>🎉 Choose your reward:</p>
    <button onClick={() => {
      const updated = { ...game, coins: game.coins + 50 };
      setGame(updated);
      localStorage.setItem("gameState", JSON.stringify(updated));
      setMessage(`${wild.name} defeated. You earned 50 coins!`);
    }}>💰 Claim 50 Coins</button>

    <button onClick={() => {
      const stage = wild.stage;
      const inventory = { ...game.inventory };
      const pokedex = [...game.pokedex];
      let updated = { ...game };

      let used = null;

      if (stage === 1 && game.pokeballs > 0) {
        updated.pokeballs -= 1;
        used = "Pokéball";
      } else if (stage === 2 && game.greatballs > 0) {
        updated.greatballs -= 1;
        used = "Great Ball";
      } else if (stage === 3 && game.ultraballs > 0) {
        updated.ultraballs -= 1;
        used = "Ultra Ball";
      } else if (wild.legendary && game.masterballs > 0 && pokedex.length === pokedex.length) {
        updated.masterballs -= 1;
        used = "Master Ball";
      } else {
        return alert("No suitable ball available.");
      }

      inventory[wild.id] = (inventory[wild.id] || 0) + 1;
      if (!pokedex.includes(wild.id)) pokedex.push(wild.id);

      updated.inventory = inventory;
      updated.pokedex = pokedex;

      setGame(updated);
      localStorage.setItem("gameState", JSON.stringify(updated));
      setMessage(`🎯 You used a ${used} and caught ${wild.name}!`);
    }}>🎯 Catch Pokémon</button>
  </div>
)}

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}

      {playerHP <= 0 && (
        <button onClick={healAndReturn} style={{ marginTop: '20px' }}>
          🏥 Go to Pokémon Center
        </button>
      )}
    </main>
  );
}
