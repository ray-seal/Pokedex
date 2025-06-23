// components/Catch.js

import React, { useState } from 'react';
import pokedexData from '../public/pokedex.json';

export default function Catch({ game, setGame, back }) {
  const [wild, setWild] = useState(randomWild());

  function randomWild() {
    const randIndex = Math.floor(Math.random() * pokedexData.length);
    return pokedexData[randIndex];
  }

  const getStage = (pokemon) => {
    return pokemon.evolution_stage || 1; // default to 1 if not set
  };

  const throwBall = (ballType) => {
    let key = ballType + 's';
    if (ballType === 'pokeball') key = 'pokeballs';

    if (game[key] <= 0) {
      alert(`No ${ballType}s left!`);
      return;
    }

    // Evolution-based ball check
    const stage = getStage(wild);
    if (stage === 2 && ballType === 'pokeball') {
      alert(`${wild.name} is too strong for a Pokéball! Try a Great or better.`);
      return;
    }
    if (stage === 3 && (ballType === 'pokeball' || ballType === 'greatball')) {
      alert(`${wild.name} needs an Ultra Ball or better!`);
      return;
    }

    const updated = { ...game };
    updated[key]--;

    let baseChance = {
      pokeball: 0.5,
      greatball: 0.75,
      ultraball: 0.9,
      masterball: 1.0
    }[ballType];

    // Add berry bonus (except with masterball)
    if (game.berries > 0 && ballType !== 'masterball') {
      baseChance += 0.1;
      updated.berries--;
    }

    const success = Math.random() < baseChance;

    if (success) {
      if (!updated.caught.find(p => p.id === wild.id)) {
        updated.caught.push(wild);
        alert(`You caught ${wild.name}!`);
      } else {
        alert(`${wild.name} is a duplicate! You can sell it in the lab.`);
        updated.caught.push(wild); // allow duplicates for lab
      }
    } else {
      alert(`${wild.name} escaped!`);
    }

    setGame(updated);
    setWild(randomWild());
  };

  return (
    <div>
      <h2>Wild {wild.name} appeared!</h2>
      <img src={wild.sprite} alt={wild.name} width="96" height="96" />
      <p>Choose a ball to throw:</p>
      <button onClick={() => throwBall('pokeball')}>Pokéball ({game.pokeballs})</button>
      <button onClick={() => throwBall('greatball')}>Great Ball ({game.greatballs})</button>
      <button onClick={() => throwBall('ultraball')}>Ultra Ball ({game.ultraballs})</button>
      {game.caught.length >= 151 && (
        <button onClick={() => throwBall('masterball')}>Master Ball ({game.masterballs})</button>
      )}
      <p>Berries: {game.berries}</p>
      <br />
      <button onClick={back}>⬅ Back to Main</button>
    </div>
  );
}
