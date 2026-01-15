'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GameState, GameContextType } from '@/types/space-invaders/game.types';
import { loadGameState, saveGameState, clearGameState } from '@/lib/space-invaders/game-storage';
import { createInitialGameState } from '@/lib/space-invaders/game-engine/initial-state.factory';
import gameConfigData from '@/data/space-invaders/game-config.json';
import type { GameConfig } from '@/types/space-invaders/game.types';

const gameConfig = gameConfigData as GameConfig;

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
}

/**
 * Game Context Provider
 * Minimal state management - no business logic here
 */
export function GameProvider({ children }: GameProviderProps) {
  // Initialize with a placeholder - will be replaced immediately
  // Use a ref to track if we've initialized to prevent re-randomization
  const hasInitialized = React.useRef(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    // Create a temporary state - will be replaced by loaded state
    return createInitialGameState(gameConfig);
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load game state on mount - only create new if no saved state exists
  React.useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    
    loadGameState().then((savedState) => {
      if (savedState) {
        // Use saved state - don't randomize
        setGameState(savedState);
      } else {
        // Only create initial state if no saved state exists
        // This will only happen on first game start
        setGameState(createInitialGameState(gameConfig));
      }
      hasInitialized.current = true;
      setIsLoading(false);
    });
  }, []);

  // Save to server/localStorage whenever state changes (debounced)
  React.useEffect(() => {
    if (!isLoading && hasInitialized.current) {
      const timeoutId = setTimeout(() => {
        saveGameState(gameState).catch((error) => {
          console.error('Failed to save game state:', error);
        });
      }, 500); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [gameState, isLoading]);

  // Reset game to initial state
  const resetGame = useCallback(async () => {
    const initialState = createInitialGameState(gameConfig);
    setGameState(initialState);
    await clearGameState();
  }, []);

  // Update game state with partial updates
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  const value: GameContextType = {
    gameState,
    setGameState,
    resetGame,
    updateGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook to access game context
 */
export function useGameContext(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}
