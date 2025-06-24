import { useEffect, useState } from 'react';
import data from '../public/pokedex.json';
import { useRouter } from 'next/router';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [wildHP, setWildHP] = useState(100);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved || !saved.playerHP) {
      router.push('/'); // Go home if no game
    } else {
      setGame(saved);
      newEncounter(); // Start with wild encounter
    }
  }, []);

  const saveGame = (updated) => {
    setGame(updated);
    localStorage.setItem("gameState", JSON.stringify(updated));
  };

  const newEncounter = () => {
    const encounter = data[Math.floor(Math.random() * data.length)];
    setWild(encounter);
    setWildHP(100);
    setMessage(`⚔️ A wild ${encounter.name} appeared!`);
  };

  const attack = () => {
    if (!wild || !game) return;

    if (game.playerHP <= 0) {
      setMessage("💀 You’ve fainted! Heal at the Pokémon Center.");
      return;
    }

    if (wildHP <= 0) {
      setMessage(`⚠️ ${wild.name} has already fainted! Choose a reward.`);
      return;
    }

    const damageToWild = Math.floor(Math.random() * 20) + 10;
    const damageToPlayer = Math.floor(Math.random() * 15) + 5;

    const newWildHP = Math.max(0, wildHP - damageToWild);
    const newPlayerHP = Math.max(0, game.playerHP - damageToPlayer);

    setWildHP(newWildHP);

    const updated = { ...game, playerHP: newPlayerHP };
    saveGame(updated);

    if (newPlayerHP === 0) {
      setMessage(`💥 You took ${damageToPlayer} damage and fainted! Heal at the Center.`);
      return;
    }

    if (newWildHP === 0) {
      setMessage(`🎉 You defeated ${wild.name}! Choose your reward.`);
    } else {
      setMessage(`💥 You hit ${wild.name} for ${damageToWild} and took ${damageToPlayer} damage.`);
    }
  };

  const claimReward = () => {
    if (!wild || wildHP > 0) return;
    const updated = { ...game, coins: game.coins + 50 };
    saveGame(updated);
    setMessage(`💰 You earned 50 coins!`);
    newEncounter();
  };

  const catchWild = () => {
    if (!wild || wildHP > 0) return;

    const { stage, legendary } = wild;
    const updated = { ...game };
    const inv = { ...updated.inventory };
    const pokedex = [...updated.pokedex];

    if (legendary) {
      if (updated.masterballs < 1) return setMessage("❌ You need a Master Ball!");
      updated.masterballs -= 1;
    } else if (stage === 3) {
      if (updated.ultraballs < 1) return setMessage("❌ You need an Ultra Ball!");
      updated.ultraballs -= 1;
    } else if (stage === 2) {
      if (updated.greatballs < 1) return setMessage("❌ You need a Great Ball!");
      updated.greatballs -= 1;
    } else {
      if (updated.pokeballs < 1) return setMessage("❌ You need a Pokéball!");
      updated.pokeballs -= 1;
    }

    inv[wild.id] = (inv[wild.id] || 0) + 1;
    if (!pokedex.includes(wild.id)) pokedex.push(wild.id);
    updated.inventory = inv;
    updated.pokedex = pokedex;

    saveGame(updated);
    setMessage(`✅ You caught ${wild.name}!`);
    newEncounter();
  };

  const run = () => {
    if (game.playerHP <= 0) {
      setMessage("💀 You’re too weak to run! Heal first.");
      return;
    }
    setMessage("🏃 You ran away!");
    newEncounter();
  };

  if (!game || !wild) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🏟️ Battle Arena</h1>
      <p>❤️ Your HP: {game.playerHP} / 100</p>
      <p>🆚 Wild: {wild.name} | HP: {wildHP} / 100</p>
      <img src={wild.sprite} alt={wild.name} width="80" style={{ imageRendering: 'pixelated' }} />

      <br /><br />
      {wildHP > 0 && game.playerHP > 0 && (
        <>
          <button onClick={attack}>🗡️ Attack</button>{" "}
          <button onClick={run}>🏃 Run</button>
        </>
      )}

      {wildHP === 0 && game.playerHP > 0 && (
        <>
          <button onClick={claimReward}>💰 Claim 50 Coins</button>{" "}
          <button onClick={catchWild}>🎯 Catch</button>
        </>
      )}

      <p style={{ marginTop: '20px' }}>{message}</p>

      <hr />
      <p>
        <a href="/">⬅️ Back to Main</a> | <a href="/center">❤️ Go to Center</a>
      </p>
    </main>
  );
}
