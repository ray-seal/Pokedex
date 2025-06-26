import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const [game, setGame] = useState(null);
  const [team, setTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showArena, setShowArena] = useState(false);
  const [arenaUnlockMsg, setArenaUnlockMsg] = useState('');
  const [coins, setCoins] = useState(0);
  const [nets, setNets] = useState(0);
  const [encounter, setEncounter] = useState(null);
  const [encounterMsg, setEncounterMsg] = useState("");
  const router = useRouter();

  const currentCounty =
    game?.location ||
    router.query.county ||
    (counties.length > 0 ? counties[0].id : '');

  // Load or initialize save on
