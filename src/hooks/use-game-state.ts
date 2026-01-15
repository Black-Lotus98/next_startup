'use client';

import { useGameContext } from '@/contexts/game-context';
import { calculateEconomy } from '@/lib/space-invaders/game-engine/economy-engine';
import gameConfigData from '@/data/space-invaders/game-config.json';
import type { GameConfig } from '@/types/space-invaders/game.types';

const gameConfig = gameConfigData as GameConfig;
import { useMemo, useCallback } from 'react';

/**
 * Custom hook for game state management
 * Combines context with business logic
 */
export function useGameState() {
  const { gameState, updateGameState, resetGame } = useGameContext();

  // Get economy values from game state (don't recalculate with new random values)
  // Economy should only be recalculated when explicitly needed (e.g., after a turn)
  const economy = useMemo(() => {
    return {
      meat_demand: gameState.meat_demand,
      alienPopulation: gameState.alienPopulation,
      meat_price: gameState.meat_price,
      stock_price: gameState.stock_price,
      priceAdjustment: gameState.priceAdjustment,
      randomAdjustment: gameState.randomAdjustment,
    };
  }, [
    gameState.meat_demand,
    gameState.alienPopulation,
    gameState.meat_price,
    gameState.stock_price,
    gameState.priceAdjustment,
    gameState.randomAdjustment,
  ]);

  // Recalculate economy with new random values (only call this when needed, e.g., after a turn)
  const recalculateEconomy = useCallback(() => {
    const newEconomy = calculateEconomy(
      {
        meat: gameState.meat,
        sympathizers: gameState.sympathizers,
        owned_stocks: gameState.owned_stocks,
        maxStock: gameState.maxStock,
      },
      gameConfig
    );
    
    updateGameState({
      meat_demand: newEconomy.meat_demand,
      alienPopulation: newEconomy.alienPopulation,
      meat_price: newEconomy.meat_price,
      stock_price: newEconomy.stock_price,
      priceAdjustment: newEconomy.priceAdjustment,
      randomAdjustment: newEconomy.randomAdjustment,
    });
  }, [gameState.meat, gameState.sympathizers, gameState.owned_stocks, gameState.maxStock, updateGameState]);

  return {
    gameState,
    economy,
    updateGameState,
    recalculateEconomy,
    resetGame,
  };
}
