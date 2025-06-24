import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || !saved.team || saved.team.length === 0) {
      alert('No team found. Returning to home.');
      router.push('/');
      return;
    }
    setGame(saved);

    // Pick first team member as player, get full pokedex info
    const playerMon = pokedex.find(p => p.id === saved.team[0].id);
    const playerStats = getPokemonStats(playerMon);
    setPlayer({ ...playerMon, hp: playerStats.hp });

    // Random opponent
    const randomOpponent = pokedex[Math.floor(Math.random() * pokedex.length)];
    const opponentStats = getPokemonStats(randomOpponent);
    setOpponent({ ...randomOpponent, hp: opponentStats.hp });
  }, []);

  const attack = () => {
    if (!player || !opponent) return;

    // Example base damages
    const basePlayerDamage = 20;
    const baseOpponentDamage = 15;

    // Use stat multipliers
    const playerStats = getPokemonStats(player);
    const opponentStats = getPokemonStats(opponent);

    const playerDamage = Math.round(basePlayerDamage * playerStats.damageMultiplier);
    const opponentDamage = Math.round(baseOpponentDamage * opponentStats.damageMultiplier);

    let newOpponentHP = opponent.hp - playerDamage;
    let newPlayerHP = player.hp - opponentDamage;

    let resultMessage = `You dealt ${playerDamage} damage! Opponent dealt ${opponentDamage} damage!`;

    if (newOpponentHP <= 0 && newPlayerHP <= 0) {
      resultMessage += " It's a tie!";
    } else if (newOpponentHP <= 0) {
      resultMessage += " You win!";
    } else if (newPlayerHP <= 0) {
      resultMessage += " You lose!";
    }

    setPlayer({ ...player, hp: Math.max(newPlayerHP, 0) });
    setOpponent({ ...opponent, hp: Math.max(newOpponentHP, 0) });
    setMessage(resultMessage);
  };

  if (!player || !opponent) return <p>Loading battle...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🏟️ Battle Arena</h1>
      <div>
        <h2>Your Pokémon</h2>
        <p>
          <img src={player.sprite} alt={player.name} width="64" /> {player.name} (HP: {player.hp})
        </p>
      </div>
      <div>
        <h2>Opponent</h2>
        <p>
          <img src={opponent.sprite} alt={opponent.name} width="64" /> {opponent.name} (HP: {opponent.hp})
        </p>
      </div>
      <button onClick={attack}>Attack!</button>
      <p>{message}</p>
      <button onClick={() => router.push('/')}>🏠 Back to Home Page</button>
    </main>
  );
}
