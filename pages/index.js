import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pokedex from '../public/pokedex.json';
import { getPokemonStats } from '../lib/pokemonStats';
import { counties } from '../data/regions';
import SatNav from '../components/SatNav';

// --- BagModal Component ---
function BagModal({ open, onClose, game, turn, wildPokemon, team, activeIdx, onUseItem }) {
  if (!open) return null;
  const ITEMS = [
    { key: 'pokeballs', name: 'Poké Ball', emoji: '🔴', type: 'ball' },
    { key: 'greatballs', name: 'Great Ball', emoji: '🔵', type: 'ball' },
    { key: 'ultraballs', name: 'Ultra Ball', emoji: '🟡', type: 'ball' },
    { key: 'masterballs', name: 'Master Ball', emoji: '🟣', type: 'ball' },
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
                {item.type === "ball" && wildPokemon && turn === "player" &&
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
          box-shadow: 0 2px 6px rgba(0,0,0,0.09);
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
// --- End BagModal ---

function xpForNextLevel(level) {
  if (level >= 100) return Infinity;
  return Math.ceil(10 * Math.pow(1.2, level - 5));
}
function getStartingLevel(mon) {
  if (mon.legendary) return 50;
  if (mon.stage === 3) return 30;
  if (mon.stage === 2) return 15;
  return 5;
}
function tryEvolve(mon) {
  if (mon.stage === 1 && mon.level >= 15 && mon.evolves_to) {
    const next = pokedex.find(p => p.id === mon.evolves_to);
    if (next) {
      return {
        ...next,
        level: mon.level,
        xp: mon.xp,
        hp: getPokemonStats(next).hp
      };
    }
  }
  if (mon.stage === 2 && mon.level >= 30 && mon.evolves_to) {
    const next = pokedex.find(p => p.id === mon.evolves_to);
    if (next) {
      return {
        ...next,
        level: mon.level,
        xp: mon.xp,
        hp: getPokemonStats(next).hp
      };
    }
  }
  return mon;
}
function getStageMultiplier(mon) {
  if (mon.legendary) return 1.7;
  if (mon.stage === 3) return 1.4;
  if (mon.stage === 2) return 1.2;
  return 1.0;
}
function getWildXP(wild) {
  if (wild.legendary) return 5;
  if (wild.stage === 3) return 4;
  if (wild.stage === 2) return 3;
  return 2;
}
function getMaxHP(mon) {
  return getPokemonStats(mon).hp;
}
function usePotion(team, idx, type) {
  const healedTeam = [...team];
  const mon = healedTeam[idx];
  const maxHP = getMaxHP(mon);
  mon.maxhp = maxHP;
  if (type === 'potions') mon.hp = Math.min(mon.hp + 10, maxHP);
  else if (type === 'superpotions') mon.hp = Math.min(mon.hp + 50, maxHP);
  else if (type === 'fullheals') mon.hp = maxHP;
  return healedTeam;
}
function grantBattleXP(team, idx, xpAmount) {
  const updatedTeam = [...team];
  let mon = updatedTeam[idx];
  if (!mon.level) mon.level = getStartingLevel(mon);
  if (!mon.xp) mon.xp = 0;
  let newXP = mon.xp + xpAmount;
  let newLevel = mon.level;
  while (newLevel < 100 && newXP >= xpForNextLevel(newLevel)) {
    newXP -= xpForNextLevel(newLevel);
    newLevel++;
  }
  mon.xp = newXP;
  mon.level = newLevel;
  let evolvedMon = tryEvolve(mon);
  evolvedMon.hp = Math.max(evolvedMon.hp || 0, mon.hp || 0);
  evolvedMon.maxhp = getMaxHP(evolvedMon);
  updatedTeam[idx] = evolvedMon;
  return updatedTeam;
}

export default function Home() {
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [wildPokemon, setWildPokemon] = useState(null);
  const [wildHP, setWildHP] = useState(null);
  const [wildMaxHP, setWildMaxHP] = useState(null);
  const [wildLevel, setWildLevel] = useState(null);
  const [message, setMessage] = useState('');
  const [catching, setCatching] = useState(false);
  const [turn, setTurn] = useState('player'); // 'player' or 'wild'
  const [battleOver, setBattleOver] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const router = useRouter();

  // --- SatNav handler ---
  const handleCountyChange = (countyId) => {
    setGame(g => ({ ...g, location: countyId }));
    router.push({ pathname: "/", query: { county: countyId } });
    setWildPokemon(null);
    setMessage(`Arrived in ${countyId}!`);
  };

  // Get county from game state, fallback to first county
  const currentCounty = game?.location || counties[0].id;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    let location = router.query.county || saved?.location || counties[0].id;
    if (!saved || !saved.team || saved.team.length === 0) {
      router.push('/team');
      return;
    }
    const newTeam = saved.team.map(mon => {
      const stats = getPokemonStats(mon);
      return {
        ...mon,
        level: mon.level || getStartingLevel(mon),
        xp: mon.xp || 0,
        hp: typeof mon.hp === "number" ? mon.hp : stats.hp,
        maxhp: stats.hp
      };
    });
    setTeam(newTeam);
    setGame({ ...saved, team: newTeam, location });
    setActiveIdx(0);
  }, [router.query.county]);

  function availableBallsForWild(wild, inventory) {
    if (!wild || !inventory) return [];
    const balls = [];
    if (inventory.pokeballs > 0 && !wild.legendary && (wild.stage || 1) <= 1) balls.push('pokeball');
    if (inventory.greatballs > 0 && !wild.legendary && (wild.stage || 1) <= 2) balls.push('greatball');
    if (inventory.ultraballs > 0 && !wild.legendary) balls.push('ultraball');
    if (inventory.masterballs > 0 && wild.legendary) balls.push('masterball');
    return balls;
  }

  // --- RANDOMIZED LEVELS BY STAGE ---
  function searchLongGrass() {
    const wild = pokedex[Math.floor(Math.random() * pokedex.length)];
    let level;
    if (wild.legendary) {
      level = 50 + Math.floor(Math.random() * 51); // 50-100
    } else if (wild.stage === 3) {
      level = 30 + Math.floor(Math.random() * 71); // 30-100
    } else if (wild.stage === 2) {
      level = 15 + Math.floor(Math.random() * 15); // 15-29
    } else {
      level = 1 + Math.floor(Math.random() * 14); // 1-14
    }
    const baseStats = getPokemonStats(wild);
    setWildPokemon(wild);
    setWildHP(baseStats.hp);
    setWildMaxHP(baseStats.hp);
    setWildLevel(level);
    setTurn('player');
    setBattleOver(false);
    setMessage(`A wild ${wild.name} (Lv.${level}) appeared in the long grass!`);
  }

  function playerAttack() {
    if (!wildPokemon || wildHP === null || battleOver || turn !== 'player') return;
    const attacker = team[activeIdx];
    if (attacker.hp <= 0) {
      setMessage("This Pokémon has fainted! Switch to another.");
      return;
    }
    const base = Math.floor(Math.random() * 11) + 15;
    const multiplier = getStageMultiplier(attacker) * (attacker.level / 10);
    const damage = Math.max(1, Math.round(base * multiplier));
    const newWildHP = Math.max(wildHP - damage, 0);
    setWildHP(newWildHP);

    if (newWildHP === 0) {
      const xpGained = getWildXP(wildPokemon);
      setMessage(`Your ${attacker.name} attacked and defeated ${wildPokemon.name}!`);
      const newTeam = grantBattleXP(team, activeIdx, xpGained);
      setTeam(newTeam);
      setGame(prev => ({ ...prev, team: newTeam }));
      localStorage.setItem('gameState', JSON.stringify({ ...game, team: newTeam }));
      setBattleOver(true);
      setTurn('player');
      setTimeout(() => {
        setWildPokemon(null);
        setWildHP(null);
        setWildLevel(null);
        setMessage(`${attacker.name} gained ${xpGained} XP!`);
      }, 1200);
    } else {
      setMessage(`Your ${attacker.name} attacked! ${wildPokemon.name} lost ${damage} HP.`);
      setTurn('wild');
      setTimeout(() => wildAttack(), 1200);
    }
  }

  function wildAttack() {
    if (!wildPokemon || battleOver) {
      setTurn('player');
      return;
    }
    const wild = wildPokemon;
    const defender = team[activeIdx];
    const base = Math.floor(Math.random() * 11) + 15;
    const multiplier = getStageMultiplier(wild) * (wildLevel / 10);
    const damage = Math.max(1, Math.round(base * multiplier));
    const newHP = Math.max(defender.hp - damage, 0);
    const newTeam = [...team];
    newTeam[activeIdx] = { ...defender, hp: newHP, maxhp: getMaxHP(defender) };
    setTeam(newTeam);
    setGame(prev => ({ ...prev, team: newTeam }));

    if (newHP === 0) {
      setMessage(`Wild ${wild.name} attacked! Your ${defender.name} fainted!`);
      if (newTeam.some(mon => mon.hp > 0)) {
        setTurn('player');
      } else {
        setBattleOver(true);
        setTurn('player');
        setMessage(`All your Pokémon have fainted!`);
        setTimeout(() => {
          setWildPokemon(null);
          setWildHP(null);
          setWildLevel(null);
        }, 1500);
      }
    } else {
      setMessage(`Wild ${wild.name} attacked! Your ${defender.name} lost ${damage} HP.`);
      setTurn('player');
    }
  }

  function handleSwitch(idx) {
    if (battleOver || idx === activeIdx || team[idx].hp <= 0 || turn !== 'player') return;
    setActiveIdx(idx);
    setMessage(`You switched to ${team[idx].name}!`);
    setTurn('wild');
    setTimeout(() => wildAttack(), 1200);
  }

  function handleUseBagItem(type) {
    // Balls:
    if (['pokeballs','greatballs','ultraballs','masterballs'].includes(type)) {
      catchWild(type);
      setShowBag(false);
      return;
    }
    // Healing:
    if (['potions','superpotions','fullheals'].includes(type)) {
      if (team[activeIdx].hp >= team[activeIdx].maxhp) {
        setMessage('HP already full!');
        setShowBag(false);
        return;
      }
      let updatedTeam = usePotion(team, activeIdx, type);
      let updatedGame = { ...game, team: updatedTeam };
      updatedGame[type] = (updatedGame[type] || 1) - 1;
      setTeam(updatedTeam);
      setGame(updatedGame);
      localStorage.setItem('gameState', JSON.stringify(updatedGame));
      setMessage(
        type === 'potions' ? "Potion used! Healed 10 HP." :
        type === 'superpotions' ? "Super Potion used! Healed 50 HP." :
        "Full Heal used! Restored to full HP."
      );
      setTurn('wild');
      setShowBag(false);
      setTimeout(() => wildAttack(), 900);
    }
  }

  // --- DYNAMIC FAIL RATE and REMEMBER LEVEL ON CATCH ---
  function catchWild(ballType) {
    if (!game || !wildPokemon || battleOver || catching) return;
    setCatching(true);
    setTimeout(() => {
      const updated = { ...game };
      // Ball checks...
      if (ballType === 'pokeballs') {
        updated.pokeballs--;
        if (wildPokemon.legendary || (wildPokemon.stage || 1) > 1) {
          setMessage("Too strong for a Poké Ball.");
          setCatching(false);
          return;
        }
      } else if (ballType === 'greatballs') {
        updated.greatballs--;
        if (wildPokemon.legendary || (wildPokemon.stage || 1) > 2) {
          setMessage("Too strong for a Great Ball.");
          setCatching(false);
          return;
        }
      } else if (ballType === 'ultraballs') {
        updated.ultraballs--;
        if (wildPokemon.legendary) {
          setMessage("Use a Master Ball for legendary Pokémon.");
          setCatching(false);
          return;
        }
      } else if (ballType === 'masterballs') {
        updated.masterballs--;
        if (!wildPokemon.legendary) {
          setMessage("Master Balls are for legendary Pokémon only.");
          setCatching(false);
          return;
        }
      }

      // ---- Dynamic fail rate calculation ----
      let wildLvl = wildLevel || 1;
      let failRate;
      if (wildPokemon.legendary) {
        failRate = 0.3 + 0.005 * (wildLvl - 50); // 30% at 50, up to 55% at 100
      } else if (wildPokemon.stage === 3) {
        failRate = 0.15 + 0.003 * (wildLvl - 30); // 15% at 30, up to ~36% at 100
      } else if (wildPokemon.stage === 2) {
        failRate = 0.08 + 0.005 * (wildLvl - 15); // 8% at 15, up to ~15% at 29
      } else {
        failRate = 0.03 + 0.005 * (wildLvl - 1); // 3% at 1, up to 10% at 14
      }
      // Reduce with HP
      let hpPercent = wildHP / wildMaxHP;
      failRate *= (0.4 + 0.6 * hpPercent);
      // Clamp
      failRate = Math.max(0.01, Math.min(failRate, 0.7));

      if (Math.random() < failRate) {
        setGame(updated);
        localStorage.setItem('gameState', JSON.stringify(updated));
        setMessage("Oh no! The ball missed!");
        setCatching(false);
        setTurn('wild');
        setTimeout(() => wildAttack(), 1200);
        return;
      }

      // ---- REMEMBER LEVEL ON CATCH ----
      if (!updated.pokedex.includes(wildPokemon.id)) {
        updated.pokedex = [...updated.pokedex, wildPokemon.id];
        // Save caught Pokémon's level and HP
        if (!updated.caughtMons) updated.caughtMons = [];
        updated.caughtMons.push({
          id: wildPokemon.id,
          level: wildLevel,
          xp: 0,
          hp: wildMaxHP, // Caught at full HP; you can use wildHP if you want
          maxhp: wildMaxHP
        });
        setMessage(`You caught ${wildPokemon.name}!`);
      } else {
        if (!updated.duplicates) updated.duplicates = {};
        updated.duplicates[wildPokemon.id] = (updated.duplicates[wildPokemon.id] || 0) + 1;
        setMessage(
          `You caught another ${wildPokemon.name}! It's a duplicate and can be sold in the Lab for 25 coins.`
        );
      }
      setGame(updated);
      localStorage.setItem('gameState', JSON.stringify(updated));
      setCatching(false);
      setBattleOver(true);
      setTimeout(() => {
        setWildPokemon(null);
        setWildHP(null);
        setWildLevel(null);
        setBattleOver(false);
      }, 1200);
    }, 750);
  }

  if (!game) return <p>Loading...</p>;

  // Get county info for display
  const countyInfo = counties.find(c => c.id === currentCounty);

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
        position: 'relative', // Required for absolute dropdown
      }}
    >
      {/* SatNav Dropdown (left) */}
      <SatNav currentCounty={currentCounty} onChange={handleCountyChange} />

      {/* Dropdown Navigation Menu - Top Right */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 32,
        zIndex: 100
      }}>
        <select
          className="poke-button"
          style={{ fontSize: '1rem', padding: '10px 18px', borderRadius: 7 }}
          defaultValue=""
          onChange={e => {
            if (e.target.value) router.push(e.target.value);
          }}
        >
          <option value="" disabled>Navigate to…</option>
          <option value="/store">🛒 Pokemart</option>
          <option value="/lab">🧑‍🔬 Professor Oak's Lab</option>
          <option value="/center">🏥 Pokémon Center</option>
          <option value="/arena">🏟️ Pokémon Arena</option>
          <option value="/pokedex">📖 Pokédex</option>
          <option value="/team">🧑‍🤝‍🧑 Choose Team</option>
          <option value="/bag">🎒 Bag</option>
        </select>
      </div>

      <BagModal
        open={showBag}
        onClose={() => setShowBag(false)}
        game={game}
        turn={turn}
        wildPokemon={wildPokemon}
        team={team}
        activeIdx={activeIdx}
        onUseItem={handleUseBagItem}
      />

      <h1 style={{marginTop: 32}}>Pokémon Adventure</h1>
      <div style={{
        textAlign: 'center',
        width: '100%',
        fontSize: '1.35rem',
        fontWeight: 'bold',
        margin: '8px 0 16px 0',
        background: 'rgba(255,255,255,0.13)',
        color: '#ffd700',
        textShadow: '1px 2px 10px #222, 1px 1px 5px #222',
        borderRadius: '10px',
        padding: '6px 0',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <span role="img" aria-label="coin" style={{fontSize:'1.7em', verticalAlign:'middle'}}>🪙</span>
        {game?.coins ?? 0} coins
      </div>

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

      <h2>Your Team</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {team.map((mon, idx) => (
          <div key={mon.id}
            style={{
              border: idx === activeIdx ? '2px solid gold' : '2px solid #fff',
              borderRadius: 12,
              background: mon.hp > 0 ? 'rgba(50,200,50,0.65)' : 'rgba(200,50,50,0.65)',
              padding: 12,
              minWidth: 95,
              textAlign: 'center',
              opacity: mon.hp > 0 ? 1 : 0.5,
              position: 'relative'
            }}>
            <img src={mon.sprite} alt={mon.name} width="48" /><br />
            <strong>{mon.name}</strong><br />
            Level: {mon.level}<br />
            XP: {mon.xp} / {xpForNextLevel(mon.level)}<br />
            HP: {mon.hp} / {mon.maxhp}
            <br />
            <button
              disabled={battleOver || idx === activeIdx || mon.hp <= 0 || turn !== 'player'}
              className="poke-button"
              style={{ fontSize: 12, marginTop: 4, opacity: (idx === activeIdx || mon.hp <= 0) ? 0.5 : 1 }}
              onClick={() => handleSwitch(idx)}
            >{idx === activeIdx ? 'Active' : 'Switch'}
            </button>
          </div>
        ))}
      </div>

      <button className="poke-button" onClick={searchLongGrass} style={{margin: '12px 0 18px 0', fontWeight: 'bold', fontSize: '1.08rem'}}>
        🌾 Search Long Grass
      </button>

      {wildPokemon && (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18, textAlign: 'center', minWidth: 120 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={wildPokemon.sprite} alt={wildPokemon.name} width="96" style={{ display: 'block' }} />
            {game.pokedex && game.pokedex.includes(wildPokemon.id) && (
              <img
                src="/pokeball.png"
                alt="Caught"
                width="32"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              />
            )}
          </div>
          <br />
          <b>{wildPokemon.name}</b>
          <div style={{marginTop: 8, fontWeight: 'bold'}}>
            HP: {wildHP} / {wildMaxHP} <span style={{marginLeft:8}}>Lv.{wildLevel}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            {turn === "player" && !battleOver && (
              <>
                <button
                  className="poke-button"
                  style={{margin: '8px 12px 0 0'}}
                  disabled={team[activeIdx].hp <= 0}
                  onClick={playerAttack}
                >
                  Attack
                </button>
                <button
                  className="poke-button"
                  style={{margin: '8px 12px 0 0'}}
                  onClick={() => setShowBag(true)}
                >
                  🎒 Bag
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <p style={{minHeight: 32}}>{message}</p>

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
