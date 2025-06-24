import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import data from '../public/pokedex.json';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [message, setMessage] = useState("");
  const [wildHP, setWildHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
  const [actionTaken, setActionTaken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved || !saved.team || saved.team.length === 0) {
      router.push("/team");
      return;
    }

    setGame(saved);
    setPlayerHP(saved.team[saved.activeIndex || 0].hp || 100);
    triggerWild();
  }, []);

  const saveGame = (updated) => {
    localStorage.setItem("gameState", JSON.stringify(updated));
    setGame(updated);
  };

  const triggerWild = () => {
    const mon = data[Math.floor(Math.random() * data.length)];
    setWild(mon);
    setWildHP(100);
    setMessage(`A wild ${mon.name} appeared!`);
    setActionTaken(false);
  };

  const attack = () => {
    if (!game || !wild || playerHP <= 0) return;

    const damage = Math.floor(Math.random() * 25) + 10;
    const newWildHP = Math.max(wildHP - damage, 0);
    setWildHP(newWildHP);
    setMessage(`You hit ${wild.name} for ${damage} damage!`);

    if (newWildHP <= 0) {
      setMessage(`${wild.name} fainted! Choose your reward.`);
      setWild(null);
      setActionTaken(true);
      return;
    }

    // Wild counterattack
    const counter = Math.floor(Math.random() * 20) + 5;
    const newPlayerHP = Math.max(playerHP - counter, 0);
    setPlayerHP(newPlayerHP);
    setMessage((prev) => prev + `\n${wild.name} hit back for ${counter} damage!`);

    const updated = { ...game };
    updated.team[updated.activeIndex || 0].hp = newPlayerHP;

    if (newPlayerHP <= 0) {
      setMessage(`${game.team[game.activeIndex].name} has fainted! You lost this battle.`);
    }

    saveGame(updated);
  };

  const run = () => {
    if (playerHP <= 0) {
      setMessage("You can't run — your Pokémon has fainted! Heal first.");
      return;
    }
    triggerWild();
  };

  const catchReward = () => {
    if (!wild) return;
    const stage = wild.stage;
    const legendary = wild.legendary;

    const updated = { ...game };
    const inventory = updated.inventory || {};
    const pokedex = updated.pokedex || [];
    let success = false;

    if (legendary && updated.masterballs > 0) {
      updated.masterballs -= 1;
      success = true;
    } else if (stage === 3 && updated.ultraballs > 0) {
      updated.ultraballs -= 1;
      success = true;
    } else if (stage === 2 && updated.greatballs > 0) {
      updated.greatballs -= 1;
      success = true;
    } else if (stage === 1 && updated.pokeballs > 0) {
      updated.pokeballs -= 1;
      success = true;
    } else {
      setMessage("You don't have the right ball to catch this Pokémon!");
      return;
    }

    if (success) {
      inventory[wild.id] = (inventory[wild.id] || 0) + 1;
      if (!pokedex.includes(wild.id)) pokedex.push(wild.id);
      updated.inventory = inventory;
      updated.pokedex = pokedex;
      setMessage(`You caught ${wild.name}!`);
      saveGame(updated);
      setWild(null);
      triggerWild();
    }
  };

  const claimCoins = () => {
    const updated = { ...game };
    updated.coins += 50;
    setMessage(`You claimed 50 coins!`);
    saveGame(updated);
    triggerWild();
  };

  const switchPokemon = (index) => {
    if (index === game.activeIndex) return;
    const updated = { ...game, activeIndex: index };
    const hp = updated.team[index].hp || 100;
    setPlayerHP(hp);
    saveGame(updated);
    setMessage(`Switched to ${data.find(p => p.id === updated.team[index].id).name}.`);
  };

  if (!game || !game.team) return <p>Loading...</p>;

  const active = game.team[game.activeIndex || 0];
  const activeMon = data.find(p => p.id === active.id);

  return (
    <main style={{ fontFamily: 'monospace', padding: 20, backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <h1>⚔️ Battle Arena</h1>
      <p><strong>Your Pokémon:</strong> {activeMon.name} (HP: {playerHP})</p>

      {wild && (
        <div>
          <p><strong>Wild Encounter:</strong> {wild.name} (HP: {wildHP})</p>
          {playerHP > 0 && !actionTaken && (
            <>
              <button onClick={attack}>⚔️ Attack</button>{' '}
              <button onClick={run}>🏃 Run</button>
            </>
          )}
        </div>
      )}

      {actionTaken && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={claimCoins}>💰 Take 50 Coins</button>{' '}
          <button onClick={catchReward}>🎯 Attempt Catch</button>
        </div>
      )}

      <p style={{ whiteSpace: 'pre-line', marginTop: '10px' }}>{message}</p>

      <hr />
      <h3>🔁 Switch Pokémon</h3>
      <ul>
        {game.team.map((member, index) => {
          const mon = data.find(p => p.id === member.id);
          return (
            <li key={index}>
              <button onClick={() => switchPokemon(index)}>
                {mon.name} (HP: {member.hp})
              </button>
            </li>
          );
        })}
      </ul>

      <br />
      <button onClick={() => router.push("/")}>⬅️ Return Home</button>
      {' '} | <button onClick={() => router.push("/center")}>🏥 Pokémon Center</button>
    </main>
  );
}
