import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Center() {
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved || !saved.team) {
      router.push("/");
      return;
    }
    const healedTeam = saved.team.map(p => ({ ...p, hp: 100 }));
    const updated = { ...saved, team: healedTeam };
    localStorage.setItem("gameState", JSON.stringify(updated));
    router.push("/arena");
  }, [router]);

  return <p>🏥 Healing your team… Please wait.</p>;
}
