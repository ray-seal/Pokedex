import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import data from '../public/pokedex.json';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [enemyHP, setEnemyHP] = useState(100);
  const [battleOver, setBattleOver] = useState(false);
  const [won, setWon] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved || saved.playerHP <= 0) {
      router.push("/");
      return;
    }
    setGame(saved);
  }, []);

  useEffect(() => {
    if (data.length && game && (!wild || battleOver)) {
      const random = data[Math.floor(Math.random() * data.length)];
      setWild(random);
      setEnemyHP(100);
      setBattleOver(false);
      setWon(false);
    }
  }, [game, battleOver]);

  const attack = () => {
    if (!wild || battleOver || game.playerHP <= 0) return;

    const dmgToWild = Math.floor(Math.random() * 30) + 10;
    const dmgToPlayer = Math.floor(Math.random() * 20) + 5;

    const newEnemyHP = Math.max(0, enemyHP - dmgToWild);
    const newPlayerHP = Math.max(0, game.playerHP - dmgToPlayer);

    if (newPlayerHP <= 0) {
      setGame({ ...game, playerHP: 0 });
      localStorage.setItem("gameState", JSON.stringify({ ...game, playerHP: 0 }));
      setBattleOver(true);
      return;
    }

    setEnemyHP(newEnemyHP);
    if (newEnemyHP <= 0) {
      setWon(true);
      setBattleOver(true);
    }

    const updated = { ...game, playerHP: newPlayerHP };
    setGame(updated);
    localStorage.setItem("gameState", JSON.stringify(updated));
  };

  const claimReward = () => {
    const updated = { ...game, coins: game.coins + 50 };
    setGame(updated);
    localStorage.setItem("gameState", JSON.stringify(updated));
    setBattleOver(true);
  };

  const tryCatch = () => {
    const { stage, legendary, id, name } = wild;
    const updated = { ...game };
    const inv = { ...game.inventory };

    if (!inv[id]) inv[id] = 0;
    if (!updated.pokedex.includes(id)) updated.pokedex.push(id);

    const useBall = () => {
      if (legendary && updated.masterballs > 0) {
        updated.masterballs--;
        return true;
      }
      if (stage === 3 && updated.ultraballs > 0) {
        updated.ultraballs--;
        return true;
      }
      if (stage === 2 && updated.greatballs > 0) {
        updated.greatballs--;
        return true;
      }
      if (stage === 1 && updated.pokeballs > 0) {
        updated.pokeballs--;
        return true;
      }
      return false;
    };

    if (!useBall()) {
      alert("No suitable balls left to catch this Pokémon.");
      return;
    }

    inv[id]++;
    updated.inventory = inv;
    updated.pokedex = updated.pokedex;
    setGame(updated);
    localStorage.setItem("gameState", JSON.stringify(updated));
    setBattleOver(true);
  };

  if (!game || !wild) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>⚔️ Battle Arena</h1>
      <p>👤 Player HP: {game.playerHP}</p>
      <p>🐾 Wild {wild.name} HP: {enemyHP}</p>
      <img src={wild.sprite} width="64" />
      {!battleOver && <button onClick={attack}>🗡️ Attack</button>}

      {battleOver && won && (
        <>
          <p>🎉 You defeated {wild.name}!</p>
          <button onClick={claimReward}>💰 Take 50 Coins</button>
          <button onClick={tryCatch}>🎯 Try to Catch</button>
        </>
      )}

      {game.playerHP <= 0 && (
        <p style={{ color: 'red' }}>You fainted! Visit the Pokémon Center to recover.</p>
      )}

      <br /><br />
      <button onClick={() => router.push("/")}>⬅️ Back</button>
    </main>
  );
}
