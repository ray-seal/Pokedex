// lib/pokemonStats.js
export function getPokemonStats(pokemon) {
  if (pokemon.legendary) {
    return { hp: 225, damageMultiplier: 1.2 };
  }
  if (pokemon.stage === 3) {
    return { hp: 175, damageMultiplier: 1.1 };
  }
  if (pokemon.stage === 2) {
    return { hp: 125, damageMultiplier: 1.05 };
  }
  return { hp: 100, damageMultiplier: 1.0 };
}
