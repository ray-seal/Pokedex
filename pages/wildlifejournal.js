import { useEffect, useState } from 'react';
import data from '../public/wildlifejournal.json';
import { useRouter } from 'next/router';

export default function Pokedex() {
  const [game, setGame] = useState(null);
  const [expanded, setExpanded] = useState({});
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved) setGame(saved);
  }, []);

  if (!game) return <p>Loading...</p>;

  const caughtCount = game.wildlifejournal.length;
  const totalCount = 151;

  function padNum(n) {
    return n.toString().padStart(3, '0');
  }

  function toggleExpand(id) {
    setExpanded(exp => ({ ...exp, [id]: !exp[id] }));
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', background: '#ffe5e5', minHeight: '100vh' }}>
      {/* Home Button */}
      <button
        className="poke-button"
        style={{ marginBottom: 18 }}
        onClick={() => router.push('/')}
      >
        🏠 Back to Main Page
      </button>

      {/* Caught Counter Box */}
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '18px',
        color: '#222',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: '1.2rem'
      }}>
        You’ve caught {caughtCount} out of {totalCount} Wildlife!
      </div>
      <h1>📖 Wildlife Journal</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map(p => {
          const caught = game.wildlifejournal.includes(p.id);
          const dexNum = padNum(p.id);
          if (!caught) {
            return (
              <li key={p.id} style={{
                background: '#eee',
                borderRadius: 7,
                margin: '8px 0',
                padding: '7px 14px',
                color: '#aaa',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: '1.1em'
              }}>
                <span style={{
                  background: '#fff',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  fontWeight: 700,
                  color: '#888',
                  width: 44,
                  display: 'inline-block',
                  textAlign: 'center',
                  marginRight: 6,
                }}>#{dexNum}</span>
                <img src="/unknown.png" alt="Unknown" width="32" />
                ???
              </li>
            );
          }
          return (
            <li
              key={p.id}
              style={{
                background: '#f8f8fc',
                borderRadius: 7,
                margin: '8px 0',
                padding: '7px 14px',
                color: '#222',
                cursor: 'pointer',
                boxShadow: expanded[p.id] ? '0 2px 12px #ccd' : 'none',
                border: expanded[p.id] ? '1.5px solid #aaf' : '1px solid #ddd'
              }}
              onClick={() => toggleExpand(p.id)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(p.id); }}
              aria-expanded={!!expanded[p.id]}
              title="Click to expand/collapse details"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  background: '#fff',
                  borderRadius: 4,
                  border: '1px solid #99c',
                  fontWeight: 700,
                  color: '#345',
                  width: 44,
                  display: 'inline-block',
                  textAlign: 'center',
                  marginRight: 6,
                }}>#{dexNum}</span>
                <img src={p.sprite} alt={p.name} width="32" />
                <span style={{ fontWeight: 600, minWidth: 85 }}>{p.name}</span>
                <span style={{ fontSize: 13, color: '#555', marginLeft: 8 }}>
                  {Array.isArray(p.type) ? p.type.join(' / ') : p.type}
                </span>
                <span style={{ marginLeft: 'auto', color: '#888' }}>
                  {expanded[p.id] ? "▲" : "▼"}
                </span>
              </div>
              {expanded[p.id] && (
                <div
                  style={{
                    background: '#eef4fb',
                    borderRadius: 6,
                    marginTop: 10,
                    padding: 14,
                    marginLeft: 0,
                    boxShadow: '0 1px 7px #ccd',
                    color: '#234',
                    fontSize: '1em'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:7}}>
                    <img src={p.sprite} alt={p.name} width="60" />
                    <div>
                      <div><b>Pokédex #:</b> {dexNum}</div>
                      <div><b>Name:</b> {p.name}</div>
                      <div><b>Type:</b> {Array.isArray(p.type) ? p.type.join(' / ') : p.type}</div>
                      {p.stage && <div><b>Stage:</b> {p.stage}</div>}
                      {typeof p.evolves_to === 'number' && <div><b>Evolves to:</b> #{padNum(p.evolves_to)}</div>}
                      {typeof p.evolves_to === 'object' && Array.isArray(p.evolves_to) && <div><b>Evolves to:</b> {p.evolves_to.map(n => `#${padNum(n)}`).join(', ')}</div>}
                      {typeof p.evolves_from === 'number' && <div><b>Evolves from:</b> #{padNum(p.evolves_from)}</div>}
                      {p.legendary && <div><b>Legendary Pokémon</b></div>}
                    </div>
                  </div>
                  <div style={{marginTop:7,fontStyle:'italic',color:'#345',fontSize:'1.05em',lineHeight:'1.5'}}>
                    {p.pokedex_entry}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
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
        ul { padding: 0; }
        li:focus { outline: 2px solid #77aaff; }
      `}</style>
    </div>
  );
}