import type { GameState } from '@/types/space-invaders/game.types';
import { getRandomValue } from '../game-utils';

/**
 * Demographics Engine - Handles birth and death calculations
 */

export interface DemographicsResult {
  numberOfBirths: number;
  numberOfDeaths: number;
}

/**
 * Calculates births and deaths for the current turn
 */
export function calculateDemographics(gameState: GameState): DemographicsResult {
  // Total human population
  const totalHumanPopulation =
    gameState.rebelHumans + gameState.sympathizers + gameState.scientists;

  // Calculate births (birth rate applied to total population)
  const numberOfBirths = Math.floor(totalHumanPopulation * gameState.birthRate);

  // Calculate deaths (death rate applied to total population)
  // Add some randomness to make it more interesting
  const baseDeaths = Math.floor(totalHumanPopulation * gameState.deathRate);
  const deathVariation = getRandomValue(-2, 2); // Small random variation
  const numberOfDeaths = Math.max(0, baseDeaths + deathVariation);

  return {
    numberOfBirths,
    numberOfDeaths,
  };
}

/**
 * Updates population based on births and deaths
 */
export function updatePopulation(
  gameState: GameState,
  demographics: DemographicsResult
): Partial<GameState> {
  const netChange = demographics.numberOfBirths - demographics.numberOfDeaths;

  // Distribute population change proportionally
  // Or you could add it all to one group, or distribute randomly
  // For now, let's add net change to rebelHumans
  const newRebelHumans = Math.max(0, gameState.rebelHumans + netChange);

  return {
    rebelHumans: newRebelHumans,
    numberOfBirths: demographics.numberOfBirths,
    numberOfDeaths: demographics.numberOfDeaths,
  };
}
