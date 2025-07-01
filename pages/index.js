import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ITEMS = [
  { key: 'pokeballs', name: 'Small Net', emoji: '🕸️' },
  { key: 'greatballs', name: 'Medium Net', emoji: '🦑' },
  { key: 'ultraballs', name: 'Large Net', emoji: '🦈' },
  { key: 'masterballs', name: 'Large Chains', emoji: '⚓️' },
  { key: 'potions', name: 'Potion (+10HP)', emoji: '🧪' },
  { key: 'superpotions', name: 'Super Potion (+50HP)', emoji: '🥤' },
  { key: 'fullheals', name: 'Full Heal (Full HP)', emoji: '💧' },
  { key: 'fwrod', name: 'Freshwater Rod', emoji: '🎣' },
  { key: 'swrod', name: 'Saltwater Rod', emoji: '🪝' },
  { key: 'maggots', name: 'Maggots (Bait)', emoji: '🪱' },
  { key: 'lugworm', name: 'Lug-worm (Bait)', emoji: '🪱' },
  { key: 'boot', name: 'Old Boot', emoji: '🥾' },
  { key: 'lure', name: 'Lost Lure', emoji: '🪝' },
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
  coins: 100,
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
  const [wildEncounter, setWildEncounter] = useState(null);

  const getNum = v => typeof v === "string" ? parseInt(v, 10) || 0 : (v || 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem('gameState');
      setGame(saved ? JSON.parse(saved) : { ...DEFAULT_GAME });
    } catch {
      setGame({ ...DEFAULT_GAME });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && game) {
      window.localStorage.setItem('gameState', JSON.stringify(game));
    }
  }, [game]);

  useEffect(() => {
    fetch('/wildlifejournal.json')
      .then(res => res.json())
      .then(data => setWildlifeJournal(Array.isArray(data) ? data : []))
      .catch(() => setWildlifeJournal([]));
  }, []);

  useEffect(() => {
    if (game && Array.isArray(game.team)) setSelectedTeam(game.team);
  }, [game?.team]);

  if (!game || !wildlifeJournal) return <p>Loading...</p>;

  const journal = Array.isArray(game.journal) ? game.journal : [];
  const team = Array.isArray(game.team) ? game.team : [];
  const caughtAnimals = wildlifeJournal.filter(animal => animal && journal.includes(animal.id));
  const filteredTeam = team.filter(id => caughtAnimals.some(a => a.id === id));

  function searchLongGrass() {
    const candidates = wildlifeJournal.filter(
      w => w && Array.isArray(w.type) && w.type.includes('grass')
    );
    if (!candidates.length) {
      setMessage("No wild grass-type animals found!");
      return;
    }
    const found = candidates[Math.floor(Math.random() * candidates.length)];
    setWildEncounter(found);
    setMessage(`🌾 A wild ${found.name} appeared! Choose a net to catch it.`);
  }

  function tryCatch(animal, ballKey) {
    const updated = { ...game };
    updated[ballKey] = getNum(updated[ballKey]) - 1;

    const successChance = {
      pokeballs: 0.4,
      greatballs: 0.6,
      ultraballs: 0.8,
      masterballs: 1.0
    }[ballKey];

    const caught = Math.random() < successChance;
    if (caught) {
      if (!updated.journal.includes(animal.id)) {
        updated.journal = [...updated.journal, animal.id];
        setMessage(`🎉 You caught ${animal.name} with a ${ITEMS.find(i => i.key === ballKey).name}!`);
      } else {
        setMessage(`🎉 You caught another ${animal.name}!`);
      }
    } else {
      setMessage(`😢 ${animal.name} escaped your ${ITEMS.find(i => i.key === ballKey).name}!`);
    }
    setWildEncounter(null);
    setGame(updated);
  }

  function goFreshwaterFishing() {
    if (getNum(game.fwrod) < 1) {
      setMessage("You need a Freshwater Rod to fish freshwater!");
      return;
    }
    if (getNum(game.maggots) < 1) {
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
    const pool = [
      ...candidates,
      ...(Math.random() < 0.2 ? [junk[Math.floor(Math.random() * junk.length)]] : [])
    ];
    if (!pool.length) {
      setMessage("No freshwater animals available!");
      return;
    }
    const catchItem = pool[Math.floor(Math.random() * pool.length)];
    let updated = { ...game, maggots: getNum(game.maggots) - 1 };
    if (!catchItem.id) {
      updated[catchItem.key] = getNum(updated[catchItem.key]) + 1;
      setMessage(`You caught a ${catchItem.name}! Better luck next time.`);
    } else {
      if (!updated.journal.includes(catchItem.id)) {
        updated.journal = [...updated.journal, catchItem.id];
        setMessage(`🎣 You caught a ${catchItem.name}!`);
      } else {
        setMessage(`🎣 You caught another ${catchItem.name}!`);
      }
    }
    setGame(updated);
  }

  function goSaltwaterFishing() {
    if (getNum(game.swrod) < 1) {
      setMessage("You need a Saltwater Rod to fish saltwater!");
      return;
    }
    if (getNum(game.lugworm) < 1) {
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
    let updated = { ...game, lugworm: getNum(game.lugworm) - 1 };
    if (!catchItem.id) {
      updated[catchItem.key] = getNum(updated[catchItem.key]) + 1;
      setMessage(`You caught a ${catchItem.name}! Better luck next time.`);
    } else {
      if (!updated.journal.includes(catchItem.id)) {
        updated.journal = [...updated.journal, catchItem.id];
        setMessage(`🪝 You caught a ${catchItem.name}!`);
      } else {
        setMessage(`🪝 You caught another ${catchItem.name}!`);
      }
    }
    setGame(updated);
  }

  function handleLocationChange(e) {
    setGame({ ...game, location: e.target.value });
  }

  function handleTeamChange() {
    const validTeam = selectedTeam.filter(id => caughtAnimals.some(a => a.id === id)).slice(0, 6);
    setGame({ ...game, team: validTeam });
    setShowTeamSelect(false);
  }

  function toggleTeamMember(id) {
    setSelectedTeam(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 6) return [...prev, id];
      return prev;
    });
  }

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
      <div style={{position:'fixed',top:0,right:0,zIndex:999}}>
        <button
          onClick={() => setShowInventory(!showInventory)}
          style={{
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
            marginTop: 0,
            background: '#333',
            color: '#fff',
            width: 240,
            zIndex: 998,
            maxHeight: '40vh',
            overflowY: 'scroll',
            borderRadius: 0,
          }}>
            {ITEMS.filter(item => getNum(game[item.key]) > 0).map(item =>
              <li key={item.key} style={{
                fontSize: 18,
                marginBottom: 12,
                display: '                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 8px',
                borderBottom: '1px solid #555'
              }}>
                <span>{item.emoji} {item.name}</span>
                <span>x{getNum(game[item.key])}</span>
              </li>
            )}
          </ul>
        )}
      </div>

      <section style={{ padding: 16, maxWidth: 720 }}>
        <h1>🌿 Wildlife Adventures</h1>
        <p>📍 Location:
          <select value={game.location} onChange={handleLocationChange} style={{ marginLeft: 8 }}>
            {LOCATIONS.map(loc => <option key={loc}>{loc}</option>)}
          </select>
        </p>
        {ARENAS[game.location] && (
          <p>🏟️ Arena: {ARENAS[game.location].name}</p>
        )}

        <div style={{ margin: '12px 0' }}>
          <button onClick={searchLongGrass}>🌾 Search Long Grass</button>
          <button onClick={goFreshwaterFishing}>🎣 Fish Freshwater</button>
          <button onClick={goSaltwaterFishing}>🪝 Fish Saltwater</button>
          <button onClick={() => setShowTeamSelect(true)}>👥 Choose Team</button>
        </div>

        {message && <p style={{ fontSize: 16, marginTop: 8 }}>{message}</p>}

        {wildEncounter && (
          <div style={{
            background: '#fff',
            padding: 16,
            border: '2px solid #444',
            borderRadius: 8,
            marginTop: 16
          }}>
            <h3>🐾 Wild Encounter!</h3>
            <p>A wild <strong>{wildEncounter.name}</strong> appeared!</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['pokeballs', 'greatballs', 'ultraballs', 'masterballs']
                .filter(key => getNum(game[key]) > 0)
                .map(key => {
                  const item = ITEMS.find(i => i.key === key);
                  return (
                    <button key={key} onClick={() => tryCatch(wildEncounter, key)}>
                      {item?.emoji} {item?.name} (x{getNum(game[key])})
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {showTeamSelect && (
          <div style={{ background: '#fff', padding: 16, marginTop: 16 }}>
            <h3>🧢 Select Your Team (Max 6)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {caughtAnimals.map(animal => (
                <button
                  key={animal.id}
                  onClick={() => toggleTeamMember(animal.id)}
                  style={{
                    padding: 8,
                    background: selectedTeam.includes(animal.id) ? '#4caf50' : '#ccc',
                    color: '#000'
                  }}
                >
                  {animal.name}
                </button>
              ))}
            </div>
            <button onClick={handleTeamChange} style={{ marginTop: 12 }}>✅ Confirm Team</button>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <h2>📓 Journal ({journal.length})</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {caughtAnimals.map(animal => (
              <div key={animal.id} style={{
                padding: 8,
                border: '1px solid #444',
                borderRadius: 6,
                background: '#eee'
              }}>
                <strong>{animal.name}</strong><br />
                <span>{animal.type?.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {medals.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3>🏅 Medals</h3>
            <p>{medals.join(', ')}</p>
          </div>
        )}
      </section>
    </main>
  );
}