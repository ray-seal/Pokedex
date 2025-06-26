import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SatNav from '../components/SatNav';
import ArenaChallenge from '../components/ArenaChallenge';
import { counties } from '../data/regions';
import wildlifejournal from '../public/wildlifejournal.json';
import { getPokemonStats } from '../lib/pokemonStats';

const ALL_MEDALS = [
  { title: 'South England Medal', emoji: '🏅' },
  { title: 'West England Medal', emoji: '🥇' },
  { title: 'North England Medal', emoji: '🥈' },
  { title: 'England Medal', emoji: '🏆' },
  { title: 'South Wales Medal', emoji: '🏅' },
  { title: 'West Wales Medal', emoji: '🥇' },
  { title: 'North Wales Medal', emoji: '🥈' },
  { title: 'Wales Medal', emoji: '🏆' },
  { title: 'South Scotland Medal', emoji: '🏅' },
  { title: 'West Scotland Medal', emoji: '🥇' },
  { title: 'North Scotland Medal', emoji: '🥈' },
  { title: 'Scotland Medal', emoji: '🏆' },
  { title: 'Northern Ireland Medal', emoji: '🏆' }
];

function getUnlockedRegions(game) {
  const unlocked = ['South'];
  if (game?.medals?.includes('South England Medal')) unlocked.push('West');
  if (game?.medals?.includes('West England Medal')) unlocked.push('North');
  if (game?.medals?.includes('North England Medal')) unlocked.push('East');
  if (game?.medals?.includes('England Medal')) unlocked.push('South Wales');
  if (game?.medals?.includes('South Wales Medal')) unlocked.push('West Wales');
  if (game?.medals?.includes('West Wales Medal')) unlocked.push('North Wales');
  if (game?.medals?.includes('North Wales Medal')) unlocked.push('East Wales');
  if (game?.medals?.includes('Wales Medal')) unlocked.push('South Scotland');
  if (game?.medals?.includes('South Scotland Medal')) unlocked.push('West Scotland');
  if (game?.medals?.includes('West Scotland Medal')) unlocked.push('North Scotland');
  if (game?.medals?.includes('North Scotland Medal')) unlocked.push('East Scotland');
  if (game?.medals?.includes('Scotland Medal')) unlocked.push('Northern Ireland');
  return unlocked;
}

function xpForNextLevel(level) {
  if (level >= 100) return Infinity;
  return Math.ceil(10 * Math.pow(1.2, level - 5));
}
function getStartingLevel(animal) {
  if (animal.legendary) return 50;
  if (animal.stage === 3) return 30;
  if (animal.stage === 2) return 15;
  return 5;
}

export default function Home() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showArena, setShowArena] = useState(false);
  const [arenaUnlockMsg, setArenaUnlockMsg] = useState('');
  const [coins, setCoins] = useState(0);
  const router = useRouter();

  const currentCounty =
    game?.location ||
    router.query.county ||
    (counties.length > 0 ? counties[0].id : '');

  // Load or initialize save on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    let location = router.query.county || saved?.location || (counties.length > 0 ? counties[0].id : '');

    if (!saved) {
      // No save: create default save, go to team page
      const starterSave = {
        coins: 100,
        medals: [],
        team: [],
        wildlifejournal: [],
        wildlifeProgress: {},
        location: counties.length > 0 ? counties[0].id : "",
      };
      localStorage.setItem('gameState', JSON.stringify(starterSave));
      setTimeout(() => {
        router.push('/team');
      }, 100);
      return;
    }

    if (!saved.team || saved.team.length === 0) {
      setGame(saved);
      setTeam([]);
      setCoins(saved.coins || 0);
      return;
    }

    const newTeam = saved.team.map(animal => {
      const stats = getPokemonStats(animal);
      return {
        ...animal,
        level: animal.level || getStartingLevel(animal),
        xp: animal.xp || 0,
        hp: typeof animal.hp === "number" ? animal.hp : stats.hp,
        maxhp: stats.hp
      };
    });
    setTeam(newTeam);
    setGame({ ...saved, team: newTeam, location });
    setActiveIdx(0);
    setCoins(saved.coins || 0);
  }, [router.query.county]);

  const unlockedRegions = getUnlockedRegions(game);
  const unlockedCounties = counties.filter(c => unlockedRegions.includes(c.region));
  const countyInfo = counties.find(c => c.id === currentCounty);

  function handleArenaMedal(medalTitle, setUnlockedAreas) {
    setGame(g => {
      if (g.medals?.includes(medalTitle)) return g;
      const unlocks = [];
      if (medalTitle === "South England Medal") unlocks.push("West");
      if (medalTitle === "West England Medal") unlocks.push("North");
      if (medalTitle === "North England Medal") unlocks.push("East");
      if (medalTitle === "England Medal") unlocks.push("South Wales");
      if (medalTitle === "South Wales Medal") unlocks.push("West Wales");
      if (medalTitle === "West Wales Medal") unlocks.push("North Wales");
      if (medalTitle === "North Wales Medal") unlocks.push("East Wales");
      if (medalTitle === "Wales Medal") unlocks.push("South Scotland");
      if (medalTitle === "South Scotland Medal") unlocks.push("West Scotland");
      if (medalTitle === "West Scotland Medal") unlocks.push("North Scotland");
      if (medalTitle === "North Scotland Medal") unlocks.push("East Scotland");
      if (medalTitle === "Scotland Medal") unlocks.push("Northern Ireland");
      const newMedals = [...(g.medals || []), medalTitle];
      const updated = { ...g, medals: newMedals };
      localStorage.setItem("gameState", JSON.stringify(updated));
      setUnlockedAreas && setUnlockedAreas(unlocks);
      if (unlocks.length) {
        setArenaUnlockMsg(`New areas unlocked: ${unlocks.join(', ')}`);
        setTimeout(() => setArenaUnlockMsg(''), 5000);
      }
      return updated;
    });
  }

  // RESET ALL PROGRESS
  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset ALL progress? This cannot be undone!")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  // No team selected yet (but save exists): force to team builder
  useEffect(() => {
    if (game && Array.isArray(game.team) && game.team.length === 0) {
      router.push('/team');
    }
  }, [game]);

  // Main screen
  if (!game || !game.team || game.team.length === 0) {
    // This will only flash for a moment before redirecting to /team if needed
    return null;
  }

  return (
    <main
      style={{
        fontFamily: 'monospace',
        minHeight: '100vh',
        color: 'white',
        background: '#184218',
        padding: 0,
        margin: 0,
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Coins visual */}
      <div style={{
        position: "fixed",
        top: 18,
        right: 24,
        fontSize: 22,
        background: "#252",
        borderRadius: 10,
        padding: "6px 18px",
        boxShadow: "0 2px 8px #0009",
        display: "flex",
        alignItems: "center",
        zIndex: 10
      }}>
        <span style={{ fontSize: 26, marginRight: 7 }}>🪙</span>
        <b>{game.coins || 0}</b>
      </div>

      {/* SatNav */}
      <SatNav
        currentCounty={currentCounty}
        onChange={countyId => {
          setGame(g => g ? { ...g, location: countyId } : g);
          router.push({ pathname: "/", query: { county: countyId } });
          setShowArena(false);
        }}
        counties={unlockedCounties}
      />

      {/* NAVIGATION BUTTONS */}
      <div style={{ display: 'flex', gap: 16, margin: '14px 0' }}>
        <button className="poke-button" onClick={() => router.push('/store')}>🛒 Store</button>
        <button className="poke-button" onClick={() => router.push('/lab')}>🧑‍🔬 Lab</button>
        <button className="poke-button" onClick={() => router.push('/wildlifejournal')}>📖 Wildlife Journal</button>
        <button className="poke-button" onClick={() => router.push('/team')}>🧑‍🤝‍🧑 Choose Team</button>
      </div>

      {/* Medals Box */}
      <div style={{
        background: "rgba(0,0,0,0.4)",
        padding: 14,
        borderRadius: 10,
        margin: '18px 0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <b style={{width:'100%',textAlign:'center'}}>Your Medals:</b>
        {ALL_MEDALS.map(m => (
          <span
            key={m.title}
            title={m.title}
            style={{
              fontSize: 28,
              opacity: game?.medals?.includes(m.title) ? 1 : 0.18,
              filter: game?.medals?.includes(m.title) ? 'drop-shadow(0 0 4px gold)' : 'none',
              margin: 2
            }}
          >
            {m.emoji}
          </span>
        ))}
      </div>

      {/* Arena Button */}
      {countyInfo?.arena && countyInfo.id === currentCounty && (
        <button
          className="poke-button"
          style={{ margin: '14px 0', fontWeight: 'bold', fontSize: '1.1rem' }}
          onClick={() => setShowArena(true)}
        >
          🏟️ Enter {countyInfo.arena.name}
        </button>
      )}

      {/* Arena Modal */}
      {showArena && countyInfo?.arena && (
        <ArenaChallenge
          arena={countyInfo.arena}
          game={game}
          setGame={setGame}
          onMedalEarned={handleArenaMedal}
        />
      )}
      {arenaUnlockMsg && (
        <div style={{
          background: "#173e11",
          color: "#2fd80a",
          fontWeight: "bold",
          borderRadius: 8,
          padding: "8px 18px",
          margin: "10px 0"
        }}>{arenaUnlockMsg}</div>
      )}

      {/* County info */}
      <div
        style={{
          background: "rgba(0,0,0,0.35)",
          padding: 16,
          borderRadius: 12,
          marginBottom: 24,
          maxWidth: 350,
        }}
      >
        <h2 style={{ margin: "0 0 8px 0" }}>
          {countyInfo?.name || currentCounty}
        </h2>
        <div style={{ fontSize: 16, marginBottom: 6 }}>
          {countyInfo?.description}
        </div>
        {countyInfo?.arena && (
          <div style={{ fontSize: 15, marginTop: 5 }}>
            <b>Arena:</b> {countyInfo.arena.name}
            <br />
            <b>Reward:</b> {countyInfo.arena.reward}
          </div>
        )}
      </div>

      {/* TEAM DISPLAY */}
      <h2>Your Team</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {team.map((animal, idx) => (
          <div key={animal.id}
            style={{
              border: idx === activeIdx ? '2px solid gold' : '2px solid #fff',
              borderRadius: 12,
              background: animal.hp > 0 ? 'rgba(50,200,50,0.65)' : 'rgba(200,50,50,0.65)',
              padding: 12,
              minWidth: 95,
              textAlign: 'center',
              opacity: animal.hp > 0 ? 1 : 0.5,
              position: 'relative'
            }}>
            <img src={animal.sprite} alt={animal.name} width="48" /><br />
            <strong>{animal.name}</strong><br />
            Level: {animal.level}<br />
            XP: {animal.xp} / {xpForNextLevel(animal.level)}<br />
            HP: {animal.hp} / {animal.maxhp}
            <br />
            <button
              disabled={idx === activeIdx || animal.hp <= 0}
              className="poke-button"
              style={{ fontSize: 12, marginTop: 4, opacity: (idx === activeIdx || animal.hp <= 0) ? 0.5 : 1 }}
              onClick={() => setActiveIdx(idx)}
            >{idx === activeIdx ? 'Active' : 'Switch'}
            </button>
          </div>
        ))}
      </div>

      {/* RESET ALL PROGRESS BUTTON */}
      <button
        className="poke-button"
        style={{ background: "#300", color: "white", marginTop: 32, marginBottom: 18, fontWeight: 'bold' }}
        onClick={handleResetProgress}
      >
        🗑️ Reset All Progress
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
