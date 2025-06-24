import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Center() {
  const [game, setGame] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) router.push("/");
    else setGame(saved);
  }, []);

  const heal = () => {
    const healed = { ...game, playerHP: 100 };
    setGame(healed);
    localStorage.setItem("gameState", JSON.stringify(healed));
    alert("You are fully healed!");
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>🏥 Pokémon Center</h1>
      <p>Your HP: {game.playerHP}</p>
      <button onClick={heal}>💉 Heal to Full</button>
      <br /><br />
      <button onClick={() => router.push("/")}>⬅️ Back</button>
    </main>
  );
}
