import React, { createContext, useContext, useEffect, useState } from 'react';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [game, setGame] = useState(null);

  // On mount, load game state from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    setGame(saved);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (game) {
      localStorage.setItem('gameState', JSON.stringify(game));
    }
  }, [game]);

  // Update game state from storage (for tab visibility, etc)
  const reloadGame = () => {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    setGame(saved);
  };

  return (
    <GameContext.Provider value={{ game, setGame, reloadGame }}>
      {children}
    </GameContext.Provider>
  );
}
