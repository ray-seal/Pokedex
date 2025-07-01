import { useState, useEffect } from 'react';
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

const DEFAULT_GAME = {
  team: [],
  journal: [],
  maggots: 0,
  lugworm: 0,
  fwrod: 0,
  swrod: 0,
  pokeballs: 0,
  greatballs: 0,
  ultraballs: 0,
  masterballs: 0,
  potions: 0,
  superpotions: 0,
  fullheals: 0,
  boot: 0,
  lure: 0,
  location: LOCATIONS[0],
};

export default function Home() {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [wildlifeJournal, setWildlifeJournal] = useState(null);
  const [message, setMessage] = useState('');
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [showInventory, setShowInventory] = useState(false);

  // Load game from localStorage only on client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem('game');
      setGame(saved ? JSON.parse(saved) : { ...DEFAULT_GAME });
    } catch {
      setGame({ ...DEFAULT_GAME });
    }
  }, []);

  // Persist game changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && game) {
      window.localStorage.setItem('game', JSON.stringify(game));
    }
  }, [game]);

  // Fetch wildlife journal data from /public
  useEffect(() => {
    fetch('/wildlifejournal.json')
      .then(res => res.json())
      .then(data => setWildlifeJournal(Array.isArray(data) ? data : []))
      .catch(() => setWildlifeJournal([]));
  }, []);

  // Sync selectedTeam with game.team
  useEffect(() => {
    if (game && Array.isArray(game.team)) setSelectedTeam(game.team);
  }, [game?.team]);

  if (!game || !wildlifeJournal) return <p>Loading...</p>;

  // Only allow caught animals for team selection
  const journal = Array.isArray(game.journal) ? game.journal : [];
  const team = Array.isArray(game.team) ? game.team : [];

  // Filter wildlifeJournal to only caught animals
  const caughtAnimals = wildlifeJournal.filter(
    animal => animal && journal.includes(animal.id)
  );

  // When displaying team, only show if they're caught
  const filteredTeam = team.filter(id => caughtAnimals.some(a => a.id === id));

  // GRASS SEARCH
  function searchLongGrass() {
    const candidates = wildlifeJournal.filter(
      w => w && Array.isArray(w.type) && w.type.includes('grass')
    );
    if (!candidates.length) {
      setMessage("No wild grass-type animals found!");
      return;
    }
    const found = candidates[Math.floor(Math.random() * candidates.length)];
    setMessage(`You found a wild ${found.name}!`);
  }

  // FRESHWATER FISHING
  function goFreshwaterFishing() {
    if (!game.maggots || game.maggots < 1) {
      setMessage("You need maggots to fish freshwater! Buy some from the store.");
      return;
    }
    const candidates = wildlifeJournal.filter(
      w => w && Array.isArray(w.type) && w.type.includes('freshwater')
    );
    const junk = [
      { key: 'boot', name: 'Old Boot', emoji: '🥾' },
      { key: 'lure', name: 'Lost Lure', emoji: '🪝' }
    ];
    // 80% wildlife, 20% junk
    const pool = [
      ...candidates,
      ...(Math.random() < 0.2 ? [junk[Math.floor(Math.random() * junk.length)]] : [])
    ];
    if (!pool.length) {
      setMessage("No freshwater animals available!");
      return;
    }
    const catchItem = pool[Math.floor(Math.random() * pool.length)];
    let updated = { ...game, maggots: game.maggots - 1 };
    if (!catchItem.id) {
      updated[catchItem.key] = (updated[catchItem.key] || 0) + 1;
      setMessage(`You caught a ${catchItem.name}! Better luck next time.`);
    } else {
      if (!updated.journal.includes(catchItem.id)) {
        updated.journal = [...updated.journal, catchItem.id];
        setMessage(`You caught a ${catchItem.name}!`);
      } else {
        setMessage(`You caught another ${catchItem.name}!`);
      }
    }
    setGame(updated);
  }

  // SALTWATER FISHING (uses same structure)
  function goSaltwaterFishing() {
    if (!game.lugworm || game.lugworm < 1) {
      setMessage("You need lug-worms to fish saltwater! Buy some from the store.");
      return;
    }
    const candidates = wildlifeJournal.filter(
      w => w && Array.isArray(w.type) && w.type.includes('saltwater')
    );
    const junk = [
      { key: 'boot', name: 'Old Boot', emoji: '🥾' },
      { key: 'lure', name: 'Lost Lure', emoji: '🪝' }
    ];
    const pool = [
      ...candidates,
      ...(Math.random() < 0.2 ? [junk[Math.floor(Math.random() * junk.length)]] : [])
    ];
    if (!pool.length) {
      setMessage("No saltwater animals available!");
      return;
    }
    const catchItem = pool[Math.floor(Math.random() * pool.length)];
    let updated = { ...game, lugworm: game.lugworm - 1 };
    if (!catchItem.id) {
      updated[catchItem.key] = (updated[catchItem.key] || 0) + 1;
      setMessage(`You caught a ${catchItem.name}! Better luck next time.`);
    } else {
      if (!updated.journal.includes(catchItem.id)) {
        updated.journal = [...updated.journal, catchItem.id];
        setMessage(`You caught a ${catchItem.name}!`);
      } else {
        setMessage(`You caught another ${catchItem.name}!`);
      }
    }
    setGame(updated);
  }

  function handleLocationChange(e) {
    setGame({ ...game, location: e.target.value });
  }

  function handleTeamChange() {
    // Only setTeam with caught animals
    const validTeam = selectedTeam.filter(id => caughtAnimals.some(a => a.id === id)).slice(0, 6);
    setGame({ ...game, team: validTeam });
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

  // Medals
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
            <select value={game.location || LOCATIONS[0]} onChange={handleLocationChange}>
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
          {filteredTeam.length > 0 ? (
            filteredTeam.map(id => {
              const animal = caughtAnimals.find(a => a.id === id);
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
        {showTeamSelect && caughtAnimals.length > 0 && (
          <div style={{ margin: "12px 0", background:'#fff', border:'1px solid #bbb', borderRadius:8, padding:12 }}>
            <b>Choose up to 6 animals for your team:</b>
            <div style={{display:'flex', flexWrap:'wrap', margin:'10px 0', gap:8}}>
              {caughtAnimals.map(animal => (
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
              🎣 Go Freshwater Fishing
            </button>
          )}
          {(game.swrod || 0) > 0 && (
            <button className='poke-button' onClick={goSaltwaterFishing} style={{ margin: '0 8px' }}>
              🪝 Go Saltwater Fishing
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
