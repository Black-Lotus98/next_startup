'use client';

import { useGameState } from './use-game-state';
import { useCallback } from 'react';
import {
  calculateDemographics,
  updatePopulation,
} from '@/lib/space-invaders/game-engine/demographics-engine';

/**
 * Hook for managing turn/year progression
 */
export function useTurnProgression() {
  const { gameState, updateGameState, recalculateEconomy } = useGameState();

  /**
   * Release meat for consumption
   * Updates meat based on amount released
   */
  const releaseMeat = useCallback(
    (amount: number): { success: boolean; message: string } => {
      if (amount < 0) {
        return { success: false, message: 'Amount cannot be negative' };
      }

      // Calculate minimum reserve (20% of current meat)
      const minimumReserve = gameState.meat * 0.2;
      const maxRelease = gameState.meat - minimumReserve;

      if (amount > maxRelease) {
        return {
          success: false,
          message: `Cannot release more than ${Math.floor(maxRelease)} kg. You must keep at least 20% (${Math.floor(minimumReserve)} kg) in reserve.`,
        };
      }

      if (amount < gameState.meat_demand) {
        return {
          success: false,
          message: `You must release at least ${Math.floor(gameState.meat_demand)} kg to meet demand.`,
        };
      }

      // Update meat (reduce by amount released)
      updateGameState({
        meat: gameState.meat - amount,
      });

      return {
        success: true,
        message: `Released ${Math.floor(amount)} kg of meat for consumption`,
      };
    },
    [gameState, updateGameState]
  );

  /**
   * Calculate and update demographics (births/deaths)
   */
  const calculateDemographicsForTurn = useCallback(() => {
    const demographics = calculateDemographics(gameState);
    const populationUpdates = updatePopulation(gameState, demographics);
    updateGameState(populationUpdates);
    return demographics;
  }, [gameState, updateGameState]);

  /**
   * Advance to next year/turn
   * Recalculates economy with new random values
   */
  const advanceTurn = useCallback(() => {
    // Advance year
    updateGameState({
      year: gameState.year + 1,
    });

    // Recalculate economy with new random values for next turn
    recalculateEconomy();
  }, [gameState.year, updateGameState, recalculateEconomy]);

  return {
    releaseMeat,
    advanceTurn,
    calculateDemographicsForTurn,
    gameState,
  };
}
