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
  // Add more arenas and their locations if needed
};

export default function Home() {
  const { game, setGame } = useGame();
  const [message, setMessage] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [teamInput, setTeamInput] = useState('');
  const [locationSelect, setLocationSelect] = useState(game?.location || LOCATIONS[0]);
  const router = useRouter();
  const [wildlifejournal, setWildlifejournal] = useState([]);
  const [showInventory, setShowInventory] = useState(false);

  useEffect(() => {
    // Simulate wildlifejournal loading
    if (window && window.wildlifejournal) setWildlifejournal(window.wildlifejournal);
  }, []);

  function goFreshwaterFishing() {
    if (!game.maggots || game.maggots < 1) {
      setMessage("You need maggots to fish freshwater! Buy some from the store.");
      return;
    }
    setMessage("You went freshwater fishing!"); // Stub
    // ...actual fishing logic...
  }
  function goSaltwaterFishing() {
    if (!game.lugworm || game.lugworm < 1) {
      setMessage("You need lug-worms to fish saltwater! Buy some from the store.");
      return;
    }
    setMessage("You went saltwater fishing!"); // Stub
    // ...actual fishing logic...
  }
  function searchLongGrass() {
    setMessage("You searched the long grass!"); // Stub
    // ...actual logic...
  }
  function handleTeamChange() {
    setGame({ ...game, team: teamInput });
    setShowTeamSelect(false);
    setTeamInput('');
  }
  function handleLocationChange(e) {
    setLocationSelect(e.target.value);
    setGame({ ...game, location: e.target.value });
  }

  if (!game) return <p>Loading...</p>;

  // Medals display stub (customize as needed)
  const medalsOwned = (game.medals || []).map(m => (
    <span key={m} style={{ marginRight: 10, fontSize: 22 }}>🏅{m}</span>
  ));

  return (
    <main style={{ fontFamily: 'monospace', minHeight: '100vh', background: '#f9f9f9', color: '#222' }}>
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
          {ITEMS.filter(item => game[item.key] > 0).map(item =>
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
          <b>Current Team:</b> {game.team || <span style={{color:'#888'}}>No team selected</span>}{" "}
          <button className="poke-button" style={{marginLeft:8}} onClick={() => setShowTeamSelect(true)}>
            Choose Team
          </button>
        </div>
        {showTeamSelect && (
          <div style={{ margin: "12px 0" }}>
            <input
              value={teamInput}
              onChange={e => setTeamInput(e.target.value)}
              placeholder="Enter team name"
              style={{fontSize:16, marginRight:8}}
            />
            <button className="poke-button" onClick={handleTeamChange}>Set Team</button>
            <button className="poke-button" style={{marginLeft:8}} onClick={()=>setShowTeamSelect(false)}>Cancel</button>
          </div>
        )}

        {/* Medals */}
        <div style={{margin: '10px 0'}}>
          <b>Medals:</b> {medalsOwned.length ? medalsOwned : <span style={{color:'#888'}}>None yet!</span>}
        </div>

        {/* Wildlife Journal */}
        <button className="poke-button" style={{margin:'8px 0'}} onClick={()=>router.push('/wildlifejournal')}>📖 Wildlife Journal</button>

        {/* Main Actions */}
        <div style={{margin: '20px 0'}}>
          <button className='poke-button' onClick={searchLongGrass} style={{marginRight:8}}>
            🌾 Search Long Grass
          </button>
          {game.fwrod > 0 && (
            <button className='poke-button' onClick={goFreshwaterFishing} style={{ margin: '0 8px' }}>
              🎣 Fish Freshwater
            </button>
          )}
          {game.swrod > 0 && (
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
        @media (max-width: 600px) {
          button[style*="position: fixed"] {
            position: fixed !important;
            bottom: 0 !important;
            top: auto !important;
            left: 0;
            width: 100vw;
            border-radius: 0;
            box-shadow: 0 -2px 10px #000a;
          }
        }
      `}</style>
    </main>
  );
}
