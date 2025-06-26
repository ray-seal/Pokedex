import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SatNav from '../components/SatNav';
import ArenaChallenge from '../components/ArenaChallenge';
import { counties } from '../data/regions';
import wildlifejournal from '../public/wildlifejournal.json';
import { getPokemonStats } from '../lib/pokemonStats';

// ------- Medal Definitions -------
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

// Helper: get unlocked regions based on medals in game.medals
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

// --- BagModal Component (unchanged) ---
function BagModal({ open, onClose, game, turn, wildAnimal, team, activeIdx, onUseItem }) {
  if (!open) return null;
  const ITEMS = [
    { key: 'pokeballs', name: 'Small Net', emoji: '🕸️', type: 'net' },
    { key: 'greatballs', name: 'Medium Net', emoji: '🪢', type: 'net' },
    { key: 'ultraballs', name: 'Large Net', emoji: '🪣', type: 'net' },
    { key: 'masterballs', name: 'Large Chains', emoji: '⛓️', type: 'net' },
    { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', type: 'heal' },
    { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🧴', type: 'heal' },
    { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', type: 'heal' },
  ];
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.70)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#262626', color: 'white', padding: 32, borderRadius: 18, minWidth: 300,
        boxShadow: '0 4px 32px #000a'
      }}>
        <h2 style={{marginTop:0}}>🎒 Bag</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ITEMS.map(item =>
            game[item.key] > 0 && (
              <li key={item.key} style={{ fontSize: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <span>{item.name}</span>
                <b style={{marginLeft:2}}>{game[item.key]}</b>
                {item.type === 'net' && wildAnimal && turn === 'player' &&
                  <button className="poke-button" style={{marginLeft:10, fontSize:13}} onClick={() => onUseItem(item.key)}>
                    Use
                  </button>
                }
                {item.type === "heal" && team && team[activeIdx] && turn === "player" && team[activeIdx].hp < team[activeIdx].maxhp &&
                  <button className="poke-button" style={{marginLeft:10, fontSize:13}} onClick={() => onUseItem(item.key)}>
                    Use
                  </button>
                }
                {item.type === "heal" && team && team[activeIdx] && team[activeIdx].hp >= team[activeIdx].maxhp &&
                  <span style={{color:'#aaa',marginLeft:10,fontSize:13}}>(Full HP)</span>
                }
              </li>
            )
          )}
        </ul>
        <button className="poke-button" style={{marginTop:18}} onClick={onClose}>Close</button>
      </div>
      <style jsx>{`
        .poke-button {
          border: 1px solid #ccc;
          background: #f9f9f9;
          padding: 8px 14px;
          border-radius: 7px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.09);
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
    </div>
  );
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
function tryEvolve(animal) {
  if (animal.stage === 1 && animal.level >= 15 && animal.evolves_to) {
    const next = wildlifejournal.find(a => a.id === animal.evolves_to);
    if (next) {
      return {
        ...next,
        level: animal.level,
        xp: animal.xp,
        hp: getPokemonStats(next).hp
      };
    }
  }
  if (animal.stage === 2 && animal.level >= 30 && animal.evolves_to) {
    const next = wildlifejournal.find(a => a.id === animal.evolves_to);
    if (next) {
      return {
        ...next,
        level: animal.level,
        xp: animal.xp,
        hp: getPokemonStats(next).hp
      };
    }
  }
  return animal;
}
function getStageMultiplier(animal) {
  if (animal.legendary) return 1.7;
  if (animal.stage === 3) return 1.4;
  if (animal.stage === 2) return 1.2;
  return 1.0;
}
function getWildXP(wild) {
  if (wild.legendary) return 5;
  if (wild.stage === 3) return 4;
  if (wild.stage === 2) return 3;
  return 2;
}
function getMaxHP(animal) {
  return getPokemonStats(animal).hp;
}
function usePotion(team, idx, type) {
  const healedTeam = [...team];
  const animal = healedTeam[idx];
  const maxHP = getMaxHP(animal);
  animal.maxhp = maxHP;
  if (type === 'potions') animal.hp = Math.min(animal.hp + 10, maxHP);
  else if (type === 'superpotions') animal.hp = Math.min(animal.hp + 50, maxHP);
  else if (type === 'fullheals') animal.hp = maxHP;
  return healedTeam;
}
function grantBattleXP(team, idx, xpAmount) {
  const updatedTeam = [...team];
  let animal = updatedTeam[idx];
  if (!animal.level) animal.level = getStartingLevel(animal);
  if (!animal.xp) animal.xp = 0;
  let newXP = animal.xp + xpAmount;
  let newLevel = animal.level;
  while (newLevel < 100 && newXP >= xpForNextLevel(newLevel)) {
    newXP -= xpForNextLevel(newLevel);
    newLevel++;
  }
  animal.xp = newXP;
  animal.level = newLevel;
  let evolvedAnimal = tryEvolve(animal);
  evolvedAnimal.hp = Math.max(evolvedAnimal.hp || 0, animal.hp || 0);
  evolvedAnimal.maxhp = getMaxHP(evolvedAnimal);
  updatedTeam[idx] = evolvedAnimal;
  return updatedTeam;
}

export default function Home() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [wildAnimal, setWildAnimal] = useState(null);
  const [wildHP, setWildHP] = useState(null);
  const [wildMaxHP, setWildMaxHP] = useState(null);
  const [wildLevel, setWildLevel] = useState(null);
  const [message, setMessage] = useState('');
  const [catching, setCatching] = useState(false);
  const [turn, setTurn] = useState('player');
  const [battleOver, setBattleOver] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const router = useRouter();

  // --- SatNav handler ---
  const currentCounty =
    game?.location ||
    router.query.county ||
    (counties.length > 0 ? counties[0].id : '');

  const handleCountyChange = (countyId) => {
    setGame(g => g ? { ...g, location: countyId } : g);
    router.push({ pathname: "/", query: { county: countyId } });
    setWildAnimal(null);
    setMessage(`Arrived in ${counties.find(c => c.id === countyId)?.name || countyId}!`);
    setShowArena(false);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    let location = router.query.county || saved?.location || (counties.length > 0 ? counties[0].id : '');
    if (!saved || !saved.team || saved.team.length === 0) {
      router.push('/team');
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
  }, [router.query.county]);

  // ---------- Battle and Bag handlers (unchanged) ----------
  // ... keep all your battle, catch, and bag logic as before ...

  // Get only unlocked regions/counties for SatNav
  const unlockedRegions = getUnlockedRegions(game);
  const unlockedCounties = counties.filter(c => unlockedRegions.includes(c.region));

  if (!game) return <p>Loading...</p>;
  const countyInfo = counties.find(c => c.id === currentCounty);

  return (
    <main
      style={{
        fontFamily: 'monospace',
        minHeight: '100vh',
        color: 'white',
        padding: 0,
        margin: 0,
        textShadow: '0 2px 8px #000, 0 0px 2px #000, 2px 2px 8px #000, 0 0 4px #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* SatNav Multi-Select */}
      <SatNav
        currentCounty={currentCounty}
        onChange={handleCountyChange}
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
          onMedalEarned={medalTitle => {
            setGame(g => ({
              ...g,
              medals: [...(g.medals || []), medalTitle]
            }));
            setShowArena(false);
          }}
        />
      )}

      {/* Show current county info and arena */}
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

      {/* YOUR TEAM */}
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
              disabled={battleOver || idx === activeIdx || animal.hp <= 0 || turn !== 'player'}
              className="poke-button"
              style={{ fontSize: 12, marginTop: 4, opacity: (idx === activeIdx || animal.hp <= 0) ? 0.5 : 1 }}
              onClick={() => setActiveIdx(idx)}
            >{idx === activeIdx ? 'Active' : 'Switch'}
            </button>
          </div>
        ))}
      </div>

      {/* ...rest of your wild animal encounter and bag modal logic as before... */}

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
