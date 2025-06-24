import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

export default function Arena() {
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [message, setMessage] = useState('');
  const [battleOver, setBattleOver] = useState(false);
  const [rewardOptions, setRewardOptions] = useState(false);
  const [canCatch, setCanCatch] = useState(false);
  const router = useRouter();

  // On mount: load save, upgrade team to full objects with correct HP, pick first as player
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved || !saved.team || saved.team.length === 0) {
      alert('No team found. Returning to home.');
      router.push('/');
      return;
    }
    // Upgrade team if needed
    let team = saved.team.map(member => {
      const mon = pokedex.find(p => p.id === member.id);
      const stats = getPokemonStats(mon);
      return { ...mon, hp: member.hp ?? stats.hp }; // keep current hp if present
    });
    setGame({ ...saved, team });
    setPlayer({ ...team[0] }); // Use first team member as player

    // Select random wild opponent
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    const wildStats = getPokemonStats(wild);
    setOpponent({ ...wild, hp: wildStats.hp });
  }, []);

  // Helper: get max HP for a mon
  function getMaxHP(mon) {
    return getPokemonStats(mon).hp;
  }

  // Helper: which balls can catch this opponent
  function availableBallsForOpponent(opponent, inventory) {
    const { stage, legendary } = opponent;
    const balls = [];
    if (!legendary) {
      if (stage <= 1 && inventory.pokeballs > 0) balls.push('pokeball');
      if (stage <= 2 && inventory.greatballs > 0) balls.push('greatball');
      if (inventory.ultraballs > 0) balls.push('ultraball');
    }
    if (legendary && inventory.masterballs > 0) balls.push('masterball');
    return balls;
  }

  // Battle logic: simple exchange of blows
  function attack() {
    if (!player || !opponent || battleOver) return;

    // Base damages (could be randomized)
    const playerStats = getPokemonStats(player);
    const opponentStats = getPokemonStats(opponent);
    const playerDamage = Math.round(20 * playerStats.damageMultiplier);
    const opponentDamage = Math.round(15 * opponentStats.damageMultiplier);

    let newOpponentHP = opponent.hp - playerDamage;
    let newPlayerHP = player.hp - opponentDamage;

    let resultMsg = `You dealt ${playerDamage} damage. The wild ${opponent.name} dealt ${opponentDamage} damage.`;

    // Clamp HP
    newOpponentHP = Math.max(newOpponentHP, 0);
    newPlayerHP = Math.max(newPlayerHP, 0);

    // Set state
    setOpponent({ ...opponent, hp: newOpponentHP });
    setPlayer({ ...player, hp: newPlayerHP });

    // End conditions
    if (newOpponentHP === 0 && newPlayerHP === 0) {
      setMessage(resultMsg + " It's a tie!");
      setBattleOver(true);
      setRewardOptions(false);
    } else if (newOpponentHP === 0) {
      setMessage(resultMsg + ` You defeated the wild ${opponent.name}!`);
      setBattleOver(true);
      setRewardOptions(true);
      // Check if player has a ball for this Pokémon
      const balls = availableBallsForOpponent(opponent, game);
      setCanCatch(balls.length > 0);
    } else if (newPlayerHP === 0) {
      setMessage(resultMsg + " Your Pokémon fainted! You lose the battle.");
      setBattleOver(true);
      setRewardOptions(false);
    } else {
      setMessage(resultMsg);
    }
  }

  // Reward: 50 coins
  function claimCoins() {
    const updated = { ...game, coins: game.coins + 50 };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setRewardOptions(false);
    setMessage("You received 50 coins!");
  }

  // Reward: attempt catch
  function tryCatch(ballType) {
    if (!canCatch || !battleOver) return;
    const updated = { ...game };
    const { stage, legendary } = opponent;

    // Ball usage logic
    if (ballType === 'pokeball') {
      if (updated.pokeballs < 1) return setMessage("No Pokéballs left!");
      if (stage > 1 || legendary) return setMessage("Too strong for a Pokéball.");
      updated.pokeballs--;
    } else if (ballType === 'greatball') {
      if (updated.greatballs < 1) return setMessage("No Great Balls left!");
      if (stage > 2 || legendary) return setMessage("Too strong for a Great Ball.");
      updated.greatballs--;
    } else if (ballType === 'ultraball') {
      if (updated.ultraballs < 1) return setMessage("No Ultra Balls left!");
      if (legendary) return setMessage("Use a Master Ball for legendary Pokémon.");
      updated.ultraballs--;
    } else if (ballType === 'masterball') {
      if (updated.masterballs < 1) return setMessage("No Master Balls left!");
      if (!legendary) return setMessage("Master Balls are for legendary Pokémon only.");
      updated.masterballs--;
    }

    updated.inventory = updated.inventory || {};
    updated.inventory[opponent.id] = (updated.inventory[opponent.id] || 0) + 1;
    if (!updated.pokedex.includes(opponent.id)) updated.pokedex.push(opponent.id);
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setRewardOptions(false);
    setMessage(`You caught ${opponent.name}!`);
  }

  // Heal: restores all team to full HP
  function goToCenter() {
    if (!game || !game.team) return;
    const healedTeam = game.team.map(mon => ({
      ...mon,
      hp: getMaxHP(mon)
    }));
    const updated = { ...game, team: healedTeam };
    setGame(updated);
    localStorage.setItem('gameState', JSON.stringify(updated));
    setMessage("All your Pokémon are healed!");
    // Optionally: redirect to /center
    // router.push('/center');
  }

  if (!game || !player || !opponent) return <p>Loading battle...</p>;

  // Choose the available balls for the current opponent
  const balls = availableBallsForOpponent(opponent, game);

  return (
    <main
      style={{
        fontFamily: 'monospace',
        padding: 20,
        background: 'url("/arena-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        color: 'white',
        minHeight: '100vh',
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
      }}
    >
      <h1>🏟️ Battle Arena</h1>
      <div>
        <h2>Your Pokémon</h2>
        <p>
          <img src={player.sprite} alt={player.name} width="64" /> {player.name} (HP: {player.hp} / {getMaxHP(player)})
        </p>
      </div>
      <div>
        <h2>Wild Opponent</h2>
        <p>
          <img src={opponent.sprite} alt={opponent.name} width="64" /> {opponent.name} (HP: {opponent.hp} / {getMaxHP(opponent)})
        </p>
      </div>
      {!battleOver && <button className="poke-button" onClick={attack}>Attack!</button>}

      <p>{message}</p>

      {battleOver && rewardOptions && (
        <div>
          <h3>🎉 You Won! Choose your reward:</h3>
          <button className="poke-button" onClick={claimCoins}>💰 50 Coins</button>
          {canCatch &&
            <>
              <span style={{ margin: "0 10px" }} />
              <span>or try to catch:</span>
              {balls.map(ball => (
                <button
                  key={ball}
                  className="poke-button"
                  onClick={() => tryCatch(ball)}
                  style={{ marginLeft: '10px' }}
                >
                  🎯 {ball[0].toUpperCase() + ball.slice(1).replace('ball', ' Ball')}
                </button>
              ))}
            </>
          }
        </div>
      )}

      <button className="poke-button" onClick={goToCenter} style={{ marginTop: '20px' }}>
        🏥 Go to Pokémon Center (Heal)
      </button>

      <button className="poke-button" onClick={() => router.push('/')}>
        🏠 Back to Home Page
      </button>

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
          font-family: inherit;
          font-size: 1rem;
          display: inline-block;
          transition: background 0.2s, border 0.2s;
        }
        .poke-button:hover {
          background: #e0e0e0;
          border-color: #888;
        }
      `}</style>
    </main>
  );
}
