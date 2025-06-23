// pages/center.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Center() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (saved) {
      saved.playerHP = 100;
      setGame(saved);
      localStorage.setItem('gameState', JSON.stringify(saved));
    }
  }, []);

  if (!game) return <p>Restoring your team...</p>;

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: 20,
      backgroundImage: 'url("/backgrounds/center.jpg")',
      backgroundSize: 'cover',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🏥 Pokémon Center</h1>
      <p>Your Pokémon have been fully healed!</p>
      <Link href="/">🏠 Return to Main</Link><br />
      <Link href="/arena">⚔️ Return to Arena</Link>
    </main>
  );
}
