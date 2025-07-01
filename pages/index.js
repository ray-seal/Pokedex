import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useRouter } from 'next/router';

const ITEMS = [
  { key: 'pokeballs', name: 'Small Net', emoji: '🕸️', type: 'ball' },
  { key: 'greatballs', name: 'Medium Net', emoji: '🦑', type: 'ball' },
  { key: 'ultraballs', name: 'Large Net', emoji: '🦈', type: 'ball' },
  { key: 'masterballs', name: 'Large Chains', emoji: '⚓️', type: 'ball' },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪', type: 'heal' },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🥤', type: 'heal' },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧', type: 'heal' },
  { key: 'fwrod', name: 'Freshwater Rod', emoji: '🎣', type: 'rod', rodType: 'freshwater' },
  { key: 'swrod', name: 'Saltwater Rod', emoji: '🪝', type: 'rod', rodType: 'saltwater' },
  { key: 'maggots', name: 'Maggots (Bait)', emoji: '🪱', type: 'bait', baitType: 'freshwater' },
  { key: 'lugworm', name: 'Lug-worm (Bait)', emoji: '🪱', type: 'bait', baitType: 'saltwater' },
  { key: 'boot', name: 'Old Boot', emoji: '🥾', type: 'junk' },
  { key: 'lure', name: 'Lost Lure', emoji: '🪝', type: 'junk' },
];

const LOCATIONS = [
  "East Sussex",
  "West Sussex",
  "Kent",
  "Surrey",
  "London"
];

const ARENAS = {
  "East Sussex": { name: "Brighton Arena", emoji: "🏟️" },
};

export default function Home() {
  const { game, setGame } = useGame();
  const [message, setMessage] = useState('');
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [locationSelect, setLocationSelect] = useState(LOCATIONS[0]);
  const [showInventory, setShowInventory] = useState(false);
  const [wildlifeJournal, setWildlifeJournal] = useState([]);
  const router = useRouter();

  // SSR-safe: fetch wildlifeJournal on client
  useEffect(() => {
    fetch('/wildlifejournal.json')
      .then(res => res.json())
      .then(data => setWildlifeJournal(Array.isArray(data) ? data : []));
  }, []);

  // Wait for game to load
  if (!game) return <p>Loading...</p>;

  const journal = Array.isArray(game.journal) ? game.journal : [];
  const team = Array.isArray(game.team) ? game.team : [];

  // Sync selectedTeam with context
  useEffect(() => {
    setSelectedTeam(team);
  }, [game.team]);

  function getRandomFromType(type) {
    const pool = wildlifeJournal.filter(a => Array.isArray(a.type) && a.type.includes(type));
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function searchLongGrass() {
    const grassAnimal = getRandomFromType("grass");
    if (!grassAnimal) {
      setMessage("No wild grass-type animals found!");
      return;
    }
    setMessage(`A wild ${grassAnimal.name} appeared!`);
    // You might want to add to journal or trigger encounter here
  }

  function goFreshwaterFishing() {
    if ((game.maggots || 0) < 1) {
      setMessage("You need maggots to fish freshwater! Buy some from the store.");
      return;
    }
    const animal = getRandomFromType("freshwater");
    if (!animal) {
      setMessage("No freshwater animals found!");
      return;
    }
    setMessage(`You fished up a ${animal.name}!`);
    const nextJournal = journal.includes(animal.id) ? journal : [...journal, animal.id];
    setGame({ ...game, maggots: (game.maggots || 0) - 1, journal: nextJournal });
  }

  function goSaltwaterFishing() {
    if ((game.lugworm || 0) < 1) {
      setMessage("You need lug-worms to fish saltwater! Buy some from the store.");
      return;
    }
    const animal = getRandomFromType("saltwater");
    if (!animal) {
      setMessage("No saltwater animals found!");
      return;
    }
    setMessage(`You fished up a ${animal.name}!`);
    const nextJournal = journal.includes(animal.id) ? journal : [...journal, animal.id];
    setGame({ ...game, lugworm: (game.lugworm || 0) - 1, journal: nextJournal });
  }

  function handleLocationChange(e) {
    setLocationSelect(e.target.value);
    setGame({ ...game, location: e.target.value });
  }

  function handleTeamChange() {
    setGame({ ...game, team: selectedTeam });
    setShowTeamSelect(false);
  }

  function toggleTeamMember(id) {
    setSelectedTeam(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else if (prev.length < 6) {
        return [...prev, id];
      } else {
        return prev;
      }
    });
  }

  // Medals logic
  const medals = [];
  if (journal.length >= 3) medals.push("Bronze");
  if (journal.length >= 6) medals.push("Silver");
  if (journal.length >= 12) medals.push("Gold");
  if (journal.length >= 18) medals.push("Platinum");

  return (
    <main style={{
      fontFamily: 'monospace',
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #5fd36c 0%, #308c3e 100%)',
      color: '#222'
    }}>
      {/* Inventory Dropdown */}
      <button
        onClick={() => setShowInventory(!showInventory)}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 999,
          fontSize: 18,
          background: '#222',
          color: '#fff',
          border: 'none',
          padding: '8px 16px'
        }}>
        {showInventory ? "▲ Hide Inventory" : "▼ Show Inventory"}
      </button>
      {showInventory && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          marginTop: 48,
          background: '#333',
          color: '#fff',
          position: 'fixed',
          top: 40,
          right: 0,
          width: 240,
          zIndex: 998,
          maxHeight: '40vh',
          overflowY: 'scroll',
          borderRadius: 0,
        }}>
          {ITEMS.filter(item => (game[item.key] || 0) > 0).map(item =>
            <li key={item.key} style={{
              fontSize: 18,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 22 }}>{item.emoji}</span>
              <span>{item.name}</span>
              <b style={{ marginLeft: 2 }}>{game[item.key]}</b>
            </li>
          )}
        </ul>
      )}

      {/* Main UI */}
      <div style={{ paddingTop: 70, maxWidth: 480, margin: "0 auto" }}>
        <h1>Wildlife Hunter</h1>
        {/* Satnav / Location Selector */}
        <div style={{ margin: "18px 0" }}>
          <label>
            <b>Current Location: </b>
            <select value={game.location || locationSelect} onChange={handleLocationChange}>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </label>
        </div>

        {/* Arena if at correct location */}
        {ARENAS[game.location] && (
          <div style={{ margin: '12px 0', padding: '10px', border: '2px solid #888', borderRadius: 8, background: '#ffe' }}>
            <h2>{ARENAS[game.location].emoji} {ARENAS[game.location].name}</h2>
            <button className="poke-button" style={{marginTop:8}}>🏆 Enter Arena Battle</button>
          </div>
        )}

        {/* Current Team Display */}
        <div style={{margin: '10px 0'}}>
          <b>Current Team:</b>
          {team.length > 0 && wildlifeJournal.length > 0 ? (
            team.map(id => {
              const animal = wildlifeJournal.find(w => w.id === id);
              return animal ? (
                <span key={id} style={{marginLeft:8}}>
                  <img src={animal.sprite} alt={animal.name} width={30} style={{verticalAlign:'middle'}}/>
                  {animal.name}
                </span>
              ) : null;
            })
          ) : <span style={{color:'#888', marginLeft:8}}>No team selected</span>}
          <button className="poke-button" style={{marginLeft:8}} onClick={() => setShowTeamSelect(true)}>
            Change Team
          </button>
        </div>
        {showTeamSelect && wildlifeJournal.length > 0 && (
          <div style={{ margin: "12px 0", background:'#fff', border:'1px solid #bbb', borderRadius:8, padding:12 }}>
            <b>Choose up to 6 animals for your team:</b>
            <div style={{display:'flex', flexWrap:'wrap', margin:'10px 0', gap:8}}>
              {wildlifeJournal.map(animal => (
                <button key={animal.id}
                  style={{
                    border: selectedTeam.includes(animal.id) ? '2px solid #308c3e' : '1px solid #ccc',
                    background: selectedTeam.includes(animal.id) ? '#c7f7d9' : '#f9f9f9',
                    borderRadius: '6px',
                    margin: 2,
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleTeamMember(animal.id)}
                  disabled={!selectedTeam.includes(animal.id) && selectedTeam.length >= 6}
                >
                  <img src={animal.sprite} alt={animal.name} width={26} style={{verticalAlign:'middle'}} /> {animal.name}
                </button>
              ))}
            </div>
            <button className="poke-button" onClick={handleTeamChange}>Set Team</button>
            <button className="poke-button" style={{marginLeft:8}} onClick={()=>setShowTeamSelect(false)}>Cancel</button>
          </div>
        )}

        {/* Medals */}
        <div style={{margin: '10px 0'}}>
          <b>Medals:</b> {medals.length ? medals.map(m => (
            <span key={m} style={{ marginRight: 10, fontSize: 22 }}>🏅{m}</span>
          )) : <span style={{color:'#888'}}>None yet!</span>}
        </div>

        {/* Wildlife Journal */}
        <button className="poke-button" style={{margin:'8px 0'}} onClick={()=>router.push('/wildlifejournal')}>📖 Wildlife Journal</button>

        {/* Main Actions */}
        <div style={{margin: '20px 0'}}>
          <button className='poke-button' onClick={searchLongGrass} style={{marginRight:8}}>
            🌾 Search Long Grass
          </button>
          {(game.fwrod || 0) > 0 && (
            <button className='poke-button' onClick={goFreshwaterFishing} style={{ margin: '0 8px' }}>
              🎣 Fish Freshwater
            </button>
          )}
          {(game.swrod || 0) > 0 && (
            <button className='poke-button' onClick={goSaltwaterFishing} style={{ margin: '0 8px' }}>
              🪝 Fish Saltwater
            </button>
          )}
        </div>
        <p style={{ marginTop: 16 }}>{message}</p>

        <button className='poke-button' onClick={() => router.push('/store')}>Go to Store</button>
        <button className='poke-button' onClick={() => router.push('/bag')}>Open Inventory</button>
      </div>
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
        .poke-button:hover:enabled {
          background: #e0e0e0;
          border-color: #888;
        }
        .poke-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
