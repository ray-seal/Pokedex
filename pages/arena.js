import { useState, useEffect } from 'react';
import data from '../public/pokedex.json';
import Link from 'next/link';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [wild, setWild] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [wildHP, setWildHP] = useState(100);
  const [message, setMessage] = useState('');
  const [reward, setReward] = useState(null);
  const [teamSelection, setTeamSelection] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (saved) {
      setGame(saved);
      if (saved.team) setTeam(saved.team);
      if (saved.playerHP !== undefined) setPlayerHP(saved.playerHP);
      encounterWild();
    }
  }, []);

  const saveGame = (updated) => {
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
  };

  const encounterWild = () => {
    const wildMon = data[Math.floor(Math.random() * data.length)];
    setWild(wildMon);
    setWildHP(100);
    setMessage(`A wild ${wildMon.name} appeared!`);
  };

  const attack = () => {
    if (playerHP <= 0) return setMessage("You have no HP left! Go heal at the Pokémon Center.");
    const damage = Math.floor(Math.random() * 20) + 10;
    const received = Math.floor(Math.random() * 15) + 5;
    setWildHP((hp) => Math.max(hp - damage, 0));
    setPlayerHP((hp) => {
      const newHP = Math.max(hp - received, 0);
      if (newHP === 0) setMessage("You fainted! Go to the Pokémon Center.");
      return newHP;
    });

    if (wildHP - damage <= 0) {
      setMessage(`You defeated ${wild.name}!`);
      setReward(true);
    }
  };

  const run = () => {
    encounterWild();
    setReward(null);
  };

  const claimCoins = () => {
    const updated = { ...game, coins: game.coins + 50 };
    saveGame(updated);
    setMessage('You earned 50 coins!');
    setReward(null);
    encounterWild();
  };

  const tryCatch = (ballType) => {
    const stage = wild.stage;
    const { legendary } = wild;
    const updated = { ...game };
    const inventory = { ...updated.inventory };

    if (ballType === 'pokeball') {
      if (updated.pokeballs < 1) return setMessage("No Pokéballs left!");
      if (stage > 1 || legendary) return setMessage("Too strong for a Pokéball!");
      updated.pokeballs -= 1;
    } else if (ballType === 'greatball') {
      if (updated.greatballs < 1) return setMessage("No Great Balls left!");
      if (stage > 2) return setMessage("Too strong for a Great Ball!");
      updated.greatballs -= 1;
    } else if (ballType === 'ultraball') {
      if (updated.ultraballs < 1) return setMessage("No Ultra Balls left!");
      if (legendary) return setMessage("Use a Master Ball for Legendaries!");
      updated.ultraballs -= 1;
    } else if (ballType === 'masterball') {
      if (updated.masterballs < 1) return setMessage("No Master Balls left!");
      if (!legendary) return setMessage("Save this for Legendaries!");
      updated.masterballs -= 1;
    }

    if (!updated.pokedex.includes(wild.id)) updated.pokedex.push(wild.id);
    inventory[wild.id] = (inventory[wild.id] || 0) + 1;
    updated.inventory = inventory;

    saveGame(updated);
    setMessage(`You caught ${wild.name}!`);
    setReward(null);
    encounterWild();
  };

  const handleTeamChange = (id) => {
    const exists = teamSelection.includes(id);
    if (!exists && teamSelection.length >= 6) return;
    const updated = exists
      ? teamSelection.filter((i) => i !== id)
      : [...teamSelection, id];
    setTeamSelection(updated);
  };

  const confirmTeam = () => {
    if (teamSelection.length > 6) return setMessage("Choose up to 6 Pokémon.");
    const updated = { ...game, team: teamSelection };
    saveGame(updated);
    setTeam(teamSelection);
    setMessage("Team saved!");
  };

  if (!game || !wild) return <p>Loading...</p>;

  const pokedexMon = data.find(p => p.id === wild.id);

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: '20px',
      background: 'url("/arena-bg.jpg") no-repeat center center',
      backgroundSize: 'cover',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🏟️ Battle Arena</h1>
      <p>❤️ Your HP: {playerHP} / 100</p>
      <p>⚔️ Wild {wild.name}'s HP: {wildHP} / 100</p>
      <img src={wild.sprite} alt={wild.name} width="96" />

      <div style={{ marginTop: '20px' }}>
        <button onClick={attack}>⚔️ Attack</button>
        <button onClick={run}>🏃 Run</button>
      </div>

      {reward && (
        <div style={{ marginTop: '20px' }}>
          <p>🎉 Victory! Choose your reward:</p>
          <button onClick={claimCoins}>💰 50 Coins</button>
          <div>
            <button onClick={() => tryCatch('pokeball')}>Pokéball</button>
            <button onClick={() => tryCatch('greatball')}>Great Ball</button>
            <button onClick={() => tryCatch('ultraball')}>Ultra Ball</button>
            <button onClick={() => tryCatch('masterball')}>Master Ball</button>
          </div>
        </div>
      )}

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}

      <hr />
      <h3>🎯 Choose Your Team (Max 6)</h3>
      <ul>
        {game.pokedex.map(id => {
          const mon = data.find(m => m.id === id);
          return (
            <li key={id}>
              <input
                type="checkbox"
                checked={teamSelection.includes(id)}
                onChange={() => handleTeamChange(id)}
              />
              <img src={mon.sprite} alt={mon.name} width="32" /> {mon.name}
            </li>
          );
        })}
      </ul>
      <button onClick={confirmTeam}>✅ Confirm Team</button>

      <hr />
      <Link href="/">🏠 Back to Home</Link> | <Link href="/center">❤️ Pokémon Center</Link>
    </main>
  );
}
