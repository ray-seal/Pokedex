import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Center() {
  const router = useRouter();

  useEffect(() => {
    const g = JSON.parse(localStorage.getItem('gameState'));
    if (!g) return router.push('/');
    g.playerHP = 100;
    localStorage.setItem('gameState', JSON.stringify(g));
    router.push('/');
  }, []);

  return <p>Healing your Pokémon…</p>;
}
