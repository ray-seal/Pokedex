import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';

// --- PCModal Component ---
function PCModal({ open, onClose, gameState, setGameState, setTeam, setHealed }) {
  const [selected, setSelected] = useState([]);

  if (!open) return null;

  // Build full collection: team + pokedex + duplicates (all as unique slots)
  let collection = [];
  if (gameState) {
    // Add all current team Pokémon as separate slots (preserve their stats)
    (gameState.team || []).forEach(mon => {
      collection.push({ ...mon, _uniqueKey: Math.random().toString(36).slice(2) });
    });

    // Add all pokedex Pokémon not already in team (base stats)
    const teamIds = (gameState.team || []).map(mon => mon.id);
    (gameState.pokedex || []).forEach(id => {
      const countInTeam = (gameState.team || []).filter(mon => mon.id === id).length;
      // How many of this id are already in team
      const totalOwned = 1 + ((gameState.duplicates && gameState.duplicates[id]) || 0);
      // Add missing (pokedex - team count)
      for (let i = countInTeam; i < totalOwned; ++i) {
        const dexEntry = pokedex.find(p => p.id === id);
        if (dexEntry) {
          const stats = getPokemonStats(dexEntry);
          collection.push({
            ...dexEntry,
            level: dexEntry.level || 5,
            xp: dexEntry.xp || 0,
            hp: stats.hp,
            maxhp: stats.hp,
            _uniqueKey: Math.random().toString(36).slice(2)
          });
        }
      }
    });
  }

  // On modal open, set selected to the current team (by index in collection)
  useEffect(() => {
    if (open && gameState) {
      // Find, in order, the collection indexes matching the current team
      let selectedIndexes = [];
      (gameState.team || []).forEach(teamMon => {
        // Find first matching unslotted mon in collection
        for (let i = 0; i < collection.length; ++i) {
          const colMon = collection[i];
          if (
            !selectedIndexes.includes(i) && // not already selected
            colMon.id === teamMon.id &&
            (colMon.level === teamMon.level || !colMon.level) // best effort
          ) {
            selectedIndexes.push(i);
            break;
          }
        }
      });
      setSelected(selectedIndexes);
    }
    // eslint-disable-next-line
  }, [open]);

  const toggleSelection = idx => {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx));
    } else if (selected.length < 6) {
      setSelected([...selected, idx]);
    }
  };

  const confirmTeam = () => {
    // Map selected indexes to collection mons
    const newTeam = selected.map(i => {
      // Remove _uniqueKey
      const { _uniqueKey, ...mon } = collection[i];
      return { ...mon };
    });
    const updatedState = { ...gameState, team: newTeam };
    setGameState(updatedState);
    setTeam(newTeam);
    localStorage.setItem("gameState", JSON.stringify(updatedState));
    setHealed(false); // If you changed team, re-heal to be explicit
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.72)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', color: '#222', padding: 32, borderRadius: 18, minWidth: 350, maxWidth: 520,
        boxShadow: '0 4px 32px #000b'
      }}>
        <h2 style={{marginTop:0}}>💾 PC — Choose Your Team (max 6)</h2>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 20, maxHeight: 350, overflowY: 'auto'
        }}>
          {collection.length === 0 && <p>No Pokémon in your collection!</p>}
          {collection.map((mon, idx) => {
            // Count how many of this mon.id are before this index for display
            const number = 1 + collection.slice(0, idx).filter(m => m.id === mon.id).length;
            const isDuplicate = collection.filter(m => m.id === mon.id).length > 1;
            return (
              <div
                key={mon._uniqueKey}
                onClick={() => toggleSelection(idx)}
                style={{
                  border: selected.includes(idx) ? '2px solid #0a0' : '2px solid #aaa',
                  borderRadius: 10,
                  background: selected.includes(idx) ? 'rgba(180,255,180,0.19)' : 'rgba(210,210,210,0.16)',
                  cursor: 'pointer',
                  padding: 9,
                  minWidth: 72,
                  textAlign: 'center',
                  opacity: mon.hp > 0 ? 1 : 0.6,
                  position: 'relative'
                }}
              >
                <img src={mon.sprite} alt={mon.name} width="40" /><br />
                <strong>{mon.name}</strong>
                {isDuplicate && <span style={{ fontSize: 12, color: "#444" }}> #{number}</span>}
                <br />
                Lv.{mon.level} HP:{mon.hp}/{mon.maxhp}
                <div style={{
                  position: 'absolute', top: 5, right: 6, fontWeight: 'bold', color: '#090'
                }}>
                  {selected.includes(idx) ? '✔️' : ''}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 6, marginBottom: 6, color:'#b00', fontSize:15}}>
          {selected.length > 6 && "You can only select up to 6 Pokémon."}
        </div>
        <button
          className="poke-button"
          style={{marginRight: 14}}
          disabled={selected.length === 0 || selected.length > 6}
          onClick={confirmTeam}
        >
          Confirm Team
        </button>
        <button
          className="poke-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <style jsx>{`
        .poke-button {
          border: 1px solid #bbb;
          background: #f9f9f9;
          padding: 9px 17px;
          border-radius: 7px;
          cursor: pointer;
          color: #222;
          font-family: inherit;
          font-size: 1rem;
          margin: 6px 0;
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
// --- End PCModal ---

export default function Center() {
  const [healed, setHealed] = useState(false);
  const [healing, setHealing] = useState(false);
  const [showPC, setShowPC] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [team, setTeam] = useState([]);
  const router = useRouter();

  // Load gameState and current team
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    setGameState(saved);
    setTeam(saved?.team || []);
  }, []);

  const handleHeal = () => {
    setHealing(true);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem("gameState"));
      if (saved && saved.team) {
        saved.team = saved.team.map(p => {
          const pokedexEntry = pokedex.find(mon => mon.id === p.id);
          const stats = pokedexEntry ? getPokemonStats(pokedexEntry) : { hp: 100 };
          return { ...p, hp: stats.hp, maxhp: stats.hp };
        });
        localStorage.setItem("gameState", JSON.stringify(saved));
        setTeam(saved.team);
        setGameState(saved);
        setHealed(true);
      }
      setHealing(false);
    }, 900); // Simulate healing animation
  };

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: '20px',
      minHeight: '100vh',
      background: 'url("/center-bg.jpg") no-repeat center center',
      backgroundSize: 'cover',
      position: 'relative'
    }}>
      <PCModal
        open={showPC}
        onClose={() => setShowPC(false)}
        gameState={gameState}
        setGameState={setGameState}
        setTeam={setTeam}
        setHealed={setHealed}
      />
      <h1>🏥 Pokémon Center</h1>
      {healed ? (
        <p>Your team is fully healed!</p>
      ) : healing ? (
        <p>Healing your Pokémon...</p>
      ) : (
        <>
          <button
            onClick={handleHeal}
            style={{
              background: "#fff",
              border: "1px solid #bbb",
              borderRadius: 7,
              padding: "10px 20px",
              marginRight: 14,
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            ✨ Heal your Pokémon
          </button>
          <button
            onClick={() => setShowPC(true)}
            style={{
              background: "#fff",
              border: "1px solid #bbb",
              borderRadius: 7,
              padding: "10px 20px",
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            💾 Use PC (Choose Team)
          </button>
        </>
      )}
      <br /><br />
      <button
        onClick={() => router.push("/")}
        style={{
          background: "#f9f9f9",
          border: "1px solid #bbb",
          borderRadius: 7,
          padding: "8px 16px",
          cursor: "pointer",
          fontFamily: "inherit"
        }}
      >⬅️ Return Home</button>
    </main>
  );
}
