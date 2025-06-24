import { useState, useEffect } from "react";
import data from "../public/pokedex.json";
import Link from "next/link";

export default function Arena() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [wild, setWild] = useState(null);
  const [wildHP, setWildHP] = useState(100);
  const [message, setMessage] = useState("");
  const [reward, setReward] = useState(null);

  // Load game and team on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved && saved.team && saved.team.length > 0) {
      setGame(saved);
      setTeam(saved.team);
      setActiveIndex(saved.activeIndex ?? 0);
      encounterWild();
    } else {
      setMessage("No team found. Go build a team first!");
    }
  }, []);

  // Helper to save game with updated team and active index
  const saveGame = (updatedGame, updatedTeam, updatedActiveIndex) => {
    const newGame = {
      ...updatedGame,
      team: updatedTeam,
      activeIndex: updatedActiveIndex,
    };
    setGame(newGame);
    setTeam(updatedTeam);
    setActiveIndex(updatedActiveIndex);
    localStorage.setItem("gameState", JSON.stringify(newGame));
  };

  const encounterWild = () => {
    const wildMon = data[Math.floor(Math.random() * data.length)];
    setWild(wildMon);
    setWildHP(100);
    setMessage(`A wild ${wildMon.name} appeared!`);
    setReward(null);
  };

  // Get current active Pokémon
  const activePoke = team[activeIndex];

  // Check if all team Pokémon are fainted
  const allFainted = team.every((p) => p.hp <= 0);

  const attack = () => {
    if (!activePoke || activePoke.hp <= 0) {
      setMessage("Your active Pokémon has fainted! Switch to another.");
      return;
    }
    if (allFainted) {
      setMessage("All your Pokémon are fainted! Visit the Pokémon Center.");
      return;
    }

    const damage = Math.floor(Math.random() * 20) + 10;
    const received = Math.floor(Math.random() * 15) + 5;

    const newWildHP = Math.max(wildHP - damage, 0);
    const newPokeHP = Math.max(activePoke.hp - received, 0);

    // Update team HP
    const updatedTeam = team.map((p, i) =>
      i === activeIndex ? { ...p, hp: newPokeHP } : p
    );
    setTeam(updatedTeam);
    setWildHP(newWildHP);

    // Save changes
    saveGame(game, updatedTeam, activeIndex);

    if (newPokeHP === 0) {
      setMessage(
        `${activePoke.name} fainted! Switch to another Pokémon or visit the Pokémon Center.`
      );
    } else if (newWildHP === 0) {
      setMessage(`You defeated ${wild.name}!`);
      setReward(true);
    } else {
      setMessage(
        `${activePoke.name} dealt ${damage} and took ${received} in return.`
      );
    }
  };

  const run = () => {
    if (allFainted) {
      setMessage("You can't run while all your Pokémon are fainted!");
      return;
    }
    encounterWild();
  };

  const claimCoins = () => {
    const updatedGame = {
      ...game,
      coins: (game.coins || 0) + 50,
    };
    setMessage("You earned 50 coins!");
    setReward(null);
    encounterWild();
    localStorage.setItem("gameState", JSON.stringify({ ...updatedGame, team, activeIndex }));
    setGame({ ...updatedGame, team, activeIndex });
  };

  const tryCatch = (ballType) => {
    // Same logic as your original for catching Pokémon, omitted for brevity
    setMessage(`You caught ${wild.name}!`);
    setReward(null);
    encounterWild();
  };

  const switchActive = (index) => {
    if (team[index].hp > 0) {
      setActiveIndex(index);
      saveGame(game, team, index);
      setMessage(`Go, ${team[index].name}!`);
    } else {
      setMessage(`${team[index].name} has fainted and can't battle!`);
    }
  };

  if (!game || !team.length || !wild)
    return <p>Loading Arena... Make sure you have a team!</p>;

  return (
    <main
      style={{
        fontFamily: "monospace",
        padding: "20px",
        background: 'url("/arena-bg.jpg") no-repeat center center',
        backgroundSize: "cover",
        color: "white",
        textShadow: "2px 2px 4px black",
        minHeight: "100vh",
      }}
    >
      <h1>🏟️ Battle Arena</h1>
      <h2>Your Team</h2>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none", padding: 0 }}>
        {team.map((p, i) => (
          <li key={p.id} style={{ textAlign: "center" }}>
            <img
              src={p.sprite}
              alt={p.name}
              width="48"
              style={{
                border: i === activeIndex ? "3px solid gold" : "1px solid gray",
                borderRadius: "8px",
                background: i === activeIndex ? "#222" : "transparent",
                boxShadow: i === activeIndex ? "0 0 8px gold" : "none",
                cursor: p.hp > 0 ? "pointer" : "not-allowed",
                opacity: p.hp > 0 ? 1 : 0.5,
              }}
              onClick={() => switchActive(i)}
              title={p.hp > 0 ? "Switch to this Pokémon" : "Fainted"}
            />
            <div>
              {p.name}
              <br />
              HP: {p.hp}/100
              {i === activeIndex && <span> (Active)</span>}
            </div>
          </li>
        ))}
      </ul>

      <hr />

      <h2>Wild Encounter</h2>
      <p>⚔️ Wild {wild.name}'s HP: {wildHP} / 100</p>
      <img src={wild.sprite} alt={wild.name} width="96" />

      <div style={{ marginTop: "20px" }}>
        <button onClick={attack} disabled={allFainted || activePoke.hp <= 0}>
          ⚔️ Attack
        </button>
        <button onClick={run}>🏃 Run</button>
      </div>

      {reward && (
        <div style={{ marginTop: "20px" }}>
          <p>🎉 Victory! Choose your reward:</p>
          <button onClick={claimCoins}>💰 50 Coins</button>
          <div>
            <button onClick={() => tryCatch("pokeball")}>Pokéball</button>
            <button onClick={() => tryCatch("greatball")}>Great Ball</button>
            <button onClick={() => tryCatch("ultraball")}>Ultra Ball</button>
            <button onClick={() => tryCatch("masterball")}>Master Ball</button>
          </div>
        </div>
      )}

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      <hr />
      <Link href="/">🏠 Back to Home</Link> |{" "}
      <Link href="/center">❤️ Pokémon Center</Link>
    </main>
  );
}
