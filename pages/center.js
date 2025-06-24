import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Center() {
  const [healed, setHealed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved && saved.team) {
      saved.team = saved.team.map(p => ({ ...p, hp: 100 }));
      localStorage.setItem("gameState", JSON.stringify(saved));
      setHealed(true);
    }
  }, []);

  return (
    <main style={{ fontFamily: 'monospace', padding: '20px', minHeight: '100vh', backgroundColor: '#f0fff0' }}>
      <h1>🏥 Pokémon Center</h1>
      {healed ? (
        <p>Your team is fully healed!</p>
      ) : (
        <p>Healing your Pokémon...</p>
      )}
      <br />
      <button onClick={() => router.push("/")}>⬅️ Return Home</button>
    </main>
  );
}
