import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGame } from '../context/GameContext';
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

  function handleSearchGrass() {
    const wildPool = wildlifejournal.filter(a => !a.legendary && a.type === "grass");
    const random = wildPool[Math.floor(Math.random() * wildPool.length)];
    setEncounter(random);
    setEncounterMsg("");
    setChosenNet(null);
  }

  // This will be called when user selects a net and clicks "Use Net"
  function handleCatchWithNet(netKey) {
    if (!game?.[netKey] || game[netKey] < 1) {
      setEncounterMsg("You don't have any of that net left!");
      return;
    }
    const alreadyCaught = (game.wildlifejournal || []).includes(encounter.id);
    const newCount = (game[netKey] ?? 0) - 1;
    let newJournal = [...(game.wildlifejournal || [])];
    let newDuplicates = { ...(game.duplicates || {}) };
    let msg = "";

    if (!alreadyCaught) {
      newJournal.push(encounter.id);
      msg = `You caught a ${encounter.name}!`;
    } else {
      newDuplicates[encounter.id] = (newDuplicates[encounter.id] || 0) + 1;
      msg = `You caught another ${encounter.name}! (Added to duplicates for Lab)`;
    }

    const updatedGame = {
      ...game,
      [netKey]: newCount,
      wildlifejournal: newJournal,
      duplicates: newDuplicates
    };

    setGame(updatedGame);
    setEncounterMsg(msg);
    setChosenNet(null);
  }

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset ALL progress? This cannot be undone!")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  // Helper: does the user have any nets?
  function userHasAnyNet() {
    return NET_TYPES.some(nt => (game?.[nt.key] ?? 0) > 0);
  }

  return (
    <>
      <SatNav />
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Wildlife Exploration Game</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Current Location</h2>
          <p>{countyInfo ? countyInfo.name : 'Unknown'}</p>
        </div>

        <div className="mb-6">
          <button
            onClick={handleSearchGrass}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            disabled={!userHasAnyNet()}
          >
            Search the Grass for Wildlife
          </button>
          {!userHasAnyNet() && (
            <p className="text-red-600 mt-2">You need at least one net to search!</p>
          )}
        </div>

        {encounter && (
          <div className="mb-6 border p-4 rounded bg-gray-100">
            <h3 className="text-lg font-bold mb-2">Encountered: {encounter.name}</h3>
            <p>{encounter.description || 'A wild creature!'}</p>
            <p>Level: {getStartingLevel(encounter)}</p>

            <div className="mt-4">
              <h4 className="font-semibold">Choose a Net to Catch</h4>
              <div className="flex gap-2 mt-2">
                {NET_TYPES.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    className={`px-3 py-1 border rounded ${
                      chosenNet === key ? 'bg-blue-500 text-white' : 'bg-white text-black'
                    }`}
                    onClick={() => setChosenNet(key)}
                    disabled={!(game?.[key] > 0)}
                    title={`${label} (${game?.[key] ?? 0} left)`}
                  >
                    {emoji} {label} ({game?.[key] ?? 0})
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (chosenNet) {
                    handleCatchWithNet(chosenNet);
                  } else {
                    setEncounterMsg("Please choose a net first.");
                  }
                }}
                className="mt-3 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
              >
                Use Net
              </button>
              {encounterMsg && <p className="mt-2 text-green-700">{encounterMsg}</p>}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Your Team</h2>
          {team.length === 0 ? (
            <p>You have no animals on your team yet.</p>
          ) : (
            <ul className="space-y-2">
              {team.map((animal, idx) => (
                <li
                  key={animal.id}
                  className={`p-2 border rounded cursor-pointer ${
                    idx === activeIdx ? 'bg-yellow-200' : 'bg-white'
                  }`}
                  onClick={() => setActiveIdx(idx)}
                >
                  {animal.name} (Lvl {animal.level}) HP: {animal.hp}/{animal.maxhp}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowArena(true)}
            className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
          >
            Challenge Arena
          </button>
          {arenaUnlockMsg && (
            <p className="mt-2 text-indigo-600 font-semibold">{arenaUnlockMsg}</p>
          )}
        </div>

        {showArena && (
          <ArenaChallenge
            team={team}
            onClose={() => setShowArena(false)}
            onWin={(medalTitle) => {
              handleArenaMedal(medalTitle);
              setShowArena(false);
            }}
          />
        )}

        <div className="mt-10">
          <button
            onClick={handleResetProgress}
            className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </>
  );
}