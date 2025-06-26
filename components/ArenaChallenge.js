import { useState } from 'react';
import wildlifejournal from '../public/wildlifejournal.json';

function getArenaBattleAnimals(battleNum, wildlifejournal) {
  const pool = wildlifejournal.filter(a => !a.legendary && a.stage <= 3);
  let count = [3, 4, 6][battleNum];
  let maxLevel = [15, 25, 35][battleNum];
  // Randomly pick animals for this battle
  return Array.from({length: count}).map(() => {
    const wild = pool[Math.floor(Math.random() * pool.length)];
    return {
      ...wild,
      level: Math.floor(Math.random() * maxLevel) + 1,
      hp: wild.hp || 50,
      maxhp: wild.hp || 50,
    }
  });
}

export default function ArenaChallenge({ arena, game, setGame, onMedalEarned }) {
  const [stage, setStage] = useState(0); // 0, 1, 2 for the 3 battles
  const [enemyTeam, setEnemyTeam] = useState(() => getArenaBattleAnimals(0, wildlifejournal));
  const [playerIndex, setPlayerIndex] = useState(0);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [playerTeam, setPlayerTeam] = useState(game.team.map(a => ({...a})));
  const [message, setMessage] = useState('Arena Challenge!');

  // Simplified battle logic for this example:
  function nextBattle() {
    if (stage < 2) {
      setStage(stage + 1);
      setEnemyTeam(getArenaBattleAnimals(stage + 1, wildlifejournal));
      setPlayerIndex(0);
      setEnemyIndex(0);
      setMessage(`Battle ${stage + 2}!`);
      // Optionally heal player team between rounds
      setPlayerTeam(game.team.map(a => ({...a, hp: a.maxhp})));
    } else {
      // Award medal!
      setMessage(`🏅 You have won the ${arena.medalTitle}!`);
      if (onMedalEarned) onMedalEarned(arena.medalTitle);
    }
  }
  
  // Replace this with your actual battle UI/logic!
  function winBattle() {
    setTimeout(nextBattle, 1200);
    setMessage('Victory! Next battle...');
  }

  // Simple UI for demo
  return (
    <div style={{
      background: 'rgba(0,0,0,0.55)',
      borderRadius: 12,
      padding: 18,
      margin: '18px 0',
      border: '2px solid gold',
      maxWidth: 400,
    }}>
      <h3>{arena.name}</h3>
      <div><b>Arena Medal:</b> {arena.medal} {arena.medalTitle}</div>
      <div style={{margin:'8px 0'}}>{arena.description}</div>
      <div style={{margin:'8px 0',fontWeight:'bold'}}>Battle {stage+1} of 3</div>
      <div>
        <b>Enemy Team:</b>
        <ul>
          {enemyTeam.map((a,i) =>
            <li key={i}>{a.name} Lv.{a.level}</li>
          )}
        </ul>
      </div>
      <button className="poke-button" onClick={winBattle} style={{marginTop:10,fontWeight:'bold'}}>Win Battle (Demo)</button>
      <div style={{marginTop:12,color:'#ffd700'}}>{message}</div>
    </div>
  );
}
