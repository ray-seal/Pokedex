import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGame } from '../context/GameContext';
import SatNav from '../components/SatNav';
import ArenaChallenge from '../components/ArenaChallenge';
import { counties } from '../data/regions';
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

const NET_TYPES = [
  { key: 'pokeballs', label: 'Small Net', emoji: '🕸️', short: 'S' },
  { key: 'greatballs', label: 'Medium Net', emoji: '🪢', short: 'M' },
  { key: 'ultraballs', label: 'Large Net', emoji: '🪣', short: 'L' },
  { key: 'masterballs', label: 'Large Chains', emoji: '⛓️', short: 'LC' }
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
  const { game, setGame, reloadGame } = useGame();
  const [wildlifejournal, setWildlifejournal] = useState([]);
  const [loadingJournal, setLoadingJournal] = useState(true);
  const [journalError, setJournalError] = useState(null);

  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showArena, setShowArena] = useState(false);
  const [arenaUnlockMsg, setArenaUnlockMsg] = useState('');
  const [encounter, setEncounter] = useState(null);
  const [encounterMsg, setEncounterMsg] = useState("");
  const [chosenNet, setChosenNet] = useState(null);

  const router = useRouter();

  const currentCounty =
    game?.location ||
    router.query.county ||
    (counties.length > 0 ? counties[0].id : '');

  // Load wildlife journal JSON from public folder
  useEffect(() => {
    fetch('/wildlifejournal.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load wildlife journal');
        return res.json();
      })
      .then((data) => {
        setWildlifejournal(data);
        setLoadingJournal(false);
      })
      .catch((err) => {
        setJournalError(err.message);
        setLoadingJournal(false);
      });
  }, []);

  // Reload on tab focus for up-to-date state
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') reloadGame();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reloadGame]);

  useEffect(() => {
    if (!game) return;
    if (!game.team) game.team = [];
    if (!game.duplicates) game.duplicates = {};
    if (!game.wildlifejournal) game.wildlifejournal = [];
    if (!game.boot) game.boot = 0;
    if (!game.lostLure) game.lostLure = 0;

    const newTeam = game.team.map(animal => {
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
    setActiveIdx(0);
  }, [game]);

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

  // Utility: pick random from array
  function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Helper: does the user have any nets?
  function userHasAnyNet() {
    return NET_TYPES.some(nt => (game[nt.key] || 0) > 0);
  }

  // === UPDATED SEARCH GRASS (only non-legendary grass type) ===
  function handleSearchGrass() {
    if (loadingJournal || journalError) {
      setEncounterMsg("Loading wildlife data, please wait...");
      return;
    }
    const wildPool = wildlifejournal.filter(a => a.type === "grass" && !a.legendary);
    if (wildPool.length === 0) {
      setEncounter(null);
      setEncounterMsg("No grass wildlife found here.");
      return;
    }
    const random = getRandomFromArray(wildPool);
    setEncounter(random);
    setEncounterMsg("");
    setChosenNet(null);
  }

  // === FRESHWATER FISHING ===
  function handleFreshwaterFishing() {
    if (loadingJournal || journalError) {
      setEncounterMsg("Loading wildlife data, please wait...");
      return;
    }

    // 20% chance boot or lost lure
    if (Math.random() < 0.2) {
      const foundItem = Math.random() < 0.5 ? "boot" : "lostLure";
      setEncounter(null);
      setEncounterMsg(`You fished up a ${foundItem === "boot" ? "Boot" : "Lost Lure"}!`);
      setGame(g => ({ ...g, [foundItem]: (g[foundItem] || 0) + 1 }));
      return;
    }

    // Pick random freshwater animal (non-legendary)
    const wildPool = wildlifejournal.filter(a => a.type === "freshwater" && !a.legendary);
    if (wildPool.length === 0) {
      setEncounter(null);
      setEncounterMsg("No freshwater wildlife found here.");
      return;
    }
    const random = getRandomFromArray(wildPool);
    setEncounter(random);
    setEncounterMsg("");
    setChosenNet(null);
  }

  // === SALTWATER FISHING ===
  function handleSaltwaterFishing() {
    if (loadingJournal || journalError) {
      setEncounterMsg("Loading wildlife data, please wait...");
      return;
    }

    if (!game.saltwaterRod) {
      setEncounterMsg("You need to purchase a saltwater rod to fish here.");
      setEncounter(null);
      return;
    }

    // 20% chance boot or lost lure
    if (Math.random() < 0.2) {
      const foundItem = Math.random() < 0.5 ? "boot" : "lostLure";
      setEncounter(null);
      setEncounterMsg(`You fished up a ${foundItem === "boot" ? "Boot" : "Lost Lure"}!`);
      setGame(g => ({ ...g, [foundItem]: (g[foundItem] || 0) + 1 }));
      return;
    }

    // Pick random saltwater animal (non-legendary)
    const wildPool = wildlifejournal.filter(a => a.type === "saltwater" && !a.legendary);
    if (wildPool.length === 0) {
      setEncounter(null);
      setEncounterMsg("No saltwater wildlife found here.");
      return;
    }
    const random = getRandomFromArray(wildPool);
    setEncounter(random);
    setEncounterMsg("");
    setChosenNet(null);
  }

  // Use net on current encounter
  function handleCatchWithNet(netKey) {
    if (!encounter) return;
    if (!game[netKey] || game[netKey] <= 0) {
      setEncounterMsg(`You don't have any ${netKey}.`);
      return;
    }

    // Catch logic
    const catchRate = 50 + (team[activeIdx]?.level || 5) * 2; // Example catch rate formula
    const roll = Math.random() * 100;
    if (roll <= catchRate) {
      // Success
      setEncounterMsg(`You caught a ${encounter.name}!`);
      setGame(g => {
        // Add to team or duplicates
        const newTeam = [...(g.team || [])];
        if (newTeam.length < 6) {
          newTeam.push({ ...encounter, level: getStartingLevel(encounter), xp: 0 });
        } else {
          g.duplicates = g.duplicates || {};
          g.duplicates[encounter.name] = (g.duplicates[encounter.name] || 0) + 1;
        }
        // Consume one net
        g[netKey] = (g[netKey] || 1) - 1;
        localStorage.setItem("gameState", JSON.stringify(g));
        return { ...g, team: newTeam };
      });
      setEncounter(null);
    } else {
      setEncounterMsg(`The ${encounter.name} escaped!`);
    }
  }

  return (
    <>
      <SatNav />

      <main>
        <h1>Wildlife Hunting & Fishing</h1>

        <section>
          <h2>Current Location: {countyInfo?.name || currentCounty}</h2>

          <div>
            <button onClick={handleSearchGrass}>Search Grass</button>
            <button onClick={handleFreshwaterFishing}>Freshwater Fishing</button>
            <button onClick={handleSaltwaterFishing}>Saltwater Fishing</button>
          </div>

          {encounterMsg && <p>{encounterMsg}</p>}

          {encounter && (
            <div>
              <h3>Encountered: {encounter.name}</h3>
              <p>Type: {encounter.type}</p>
              <p>Stage: {encounter.stage}</p>
              <p>Legendary: {encounter.legendary ? "Yes" : "No"}</p>

              <div>
                <h4>Use a Net to Catch:</h4>
                {NET_TYPES.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    disabled={!game[key] || game[key] <= 0}
                    onClick={() => handleCatchWithNet(key)}
                  >
                    {emoji} {label} ({game[key] || 0})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4>Your Boots: {game.boot || 0}</h4>
            <h4>Your Lost Lures: {game.lostLure || 0}</h4>
          </div>
        </section>

        <ArenaChallenge onMedalEarned={handleArenaMedal} />

      </main>
    </>
  );
}