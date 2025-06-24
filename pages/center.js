import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Center() {
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const g = JSON.parse(localStorage.getItem('gameState'));
    if (g) {
      g.playerHP = 100;
      localStorage.setItem('gameState', JSON.stringify(g));
      setRestored(true);
    }
  }, []);

  if (!restored) return <p>Healing your Pokémon...</p>;

  return (
    <main style={{ fontFamily:'monospace', padding:20 }}>
      <h1>🏥 Pokémon Center</h1>
      <p>Your Pokémon have been healed!</p>
      <Link href="/">⬅️ Home</Link><br />
      <Link href="/arena">⚔️ Return to Arena</Link>
    </main>
  );
}
