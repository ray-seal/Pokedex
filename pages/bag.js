import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ITEMS = [
  { key: 'pokeballs', name: 'Poké Ball', emoji: '🔴', type: 'ball' },
  { key: 'greatballs', name: 'Great Ball', emoji: '🔵', type: 'ball' },
  { key: 'ultraballs', name: 'Ultra Ball', emoji: '🟡', type: 'ball' },
  { key: 'masterballs', name: 'Master Ball', emoji: '🟣', type: 'ball' },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', type: 'heal' },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🧴', type: 'heal' },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', type: 'heal' },
];

// Utility: get max HP of a Pokémon (requires getPokemonStats)
import { getPokemonStats } from '../lib/pokemonStats';

function getMaxHP(mon) {
  return getPokemonStats(mon).hp;
}

export default function Bag() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [wild, setWild] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const inBattle = router.query.battle === '1';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    if (!saved) {
      router.push('/');
      return;
    }
    setGame(saved);

    // In battle: get info from sessionStorage (set by arena/index page when opening bag)
    if (inBattle) {
      const team = JSON.parse(sessionStorage.getItem('bag_team') || '[]');
      const wild = JSON.parse(sessionStorage.getItem('bag_wild') || 'null');
      const activeIdx = parseInt(sessionStorage.getItem('bag_activeIdx') || '0', 10);
      setTeam(team);
      setWild(wild);
      setActiveIdx(activeIdx);
    }
  }, [inBattle, router]);

  if (!game) return <p>Loading your bag...</p>;

  // --- Item use logic ---
  function handleUse(item) {
    if (!inBattle) return;

    // For balls: only allow if a wild Pokémon is present
    if (item.type === 'ball') {
      if (!wild) {
        setMessage('No wild Pokémon to use this on!');
        return;
      }
      // Save usage intent to sessionStorage and return to battle page (let battle page handle the catch logic)
      sessionStorage.setItem('bag_use', JSON.stringify({ type: item.key }));
      router.back(); // Go back to previous page (should be battle)
      return;
    }

    // For healing: only allow if an active Pokémon needs healing
    if (item.type === 'heal') {
      if (!team.length) {
        setMessage('No Pokémon to heal!');
        return;
      }
      const mon = team[activeIdx];
      const maxHP = getMaxHP(mon);
      if (mon.hp >= maxHP) {
        setMessage('HP already full!');
        return;
      }

      let healed = { ...mon };
      if (item.key === 'potions') healed.hp = Math.min(healed.hp + 10, maxHP);
      else if (item.key === 'superpotions') healed.hp = Math.min(healed.hp + 50, maxHP);
      else if (item.key === 'fullheals') healed.hp = maxHP;

      const newTeam = [...team];
      newTeam[activeIdx] = healed;

      // Save usage intent to sessionStorage and return to battle page
      sessionStorage.setItem('bag_use', JSON.stringify({ type: item.key }));
      sessionStorage.setItem('bag_team', JSON.stringify(newTeam));
      router.back();
    }
  }

  return (
    <main
      style={{
        fontFamily: 'monospace',
        minHeight: '100vh',
        background: 'url("/main-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        color: 'white',
        padding: 0,
        margin: 0,
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ marginTop: 32 }}>🎒 Bag</h1>
      <div
        style={{
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 16,
          padding: 32,
          minWidth: 260,
          marginTop: 24,
        }}
      >
        <h2 style={{ marginBottom: 18 }}>Your Items</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {ITEMS.map(item =>
            game[item.key] > 0 ? (
              <li key={item.key} style={{ fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <span>{item.name}:</span>
                <b>{game[item.key]}</b>
                {inBattle && (
                  <button
                    className="poke-button"
                    style={{ marginLeft: 10, fontSize: 13, padding: '3px 12px' }}
                    onClick={() => handleUse(item)}
                  >
                    Use
                  </button>
                )}
              </li>
            ) : null
          )}
        </ul>
        {ITEMS.every(item => !game[item.key]) && <p>(Your bag is empty!)</p>}
        <p>{message}</p>
      </div>
      <button
        className="poke-button"
        onClick={() => router.back()}
        style={{ marginTop: 32 }}
      >
        ← Back
      </button>
      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 10px 18px;
          border-radius: 7px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.09);
          margin: 6px 0;
          cursor: pointer;
          color: #222;
          text-decoration: none;
          font-family: inherit;
          font-size: 1rem;
          display: inline-block;
          transition: background 0.18s, border 0.18s;
        }
        .poke-button:hover {
          background: #e0e0e0;
          border-color: #888;
        }
      `}</style>
    </main>
  );
}
