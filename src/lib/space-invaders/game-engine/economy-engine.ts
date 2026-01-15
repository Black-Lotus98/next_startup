import type { GameConfig } from '@/types/space-invaders/game.types';
import {
  calculateMeatDemand,
  calculateAlienPopulation,
  calculatePriceAdjustment,
  calculateMeatPrice,
  calculateStockPrice,
  generateRandomAdjustment,
  calculateStockDemand,
  calculateStockSupply,
} from './calculations';
import { getRandomValue } from '../game-utils';

/**
 * Economy Engine - Handles all economy-related calculations
 * Uses Strategy pattern for different calculation strategies
 */

export interface EconomyCalculationResult {
  meat_demand: number;
  alienPopulation: number;
  meat_price: number;
  stock_price: number;
  priceAdjustment: number;
  randomAdjustment: number;
}

/**
 * Calculates the entire economy state based on current game state and config
 */
export function calculateEconomy(
  currentState: {
    meat: number;
    sympathizers: number;
    owned_stocks: number;
    maxStock: number;
  },
  config: GameConfig
): EconomyCalculationResult {
  // Generate random values
  const meatDemandPercentage = getRandomValue(
    config.ranges.meatDemandPercentage.min,
    config.ranges.meatDemandPercentage.max
  );

  // Calculate meat demand
  const meat_demand = calculateMeatDemand(
    currentState.meat,
    meatDemandPercentage
  );

  // Calculate alien population
  const alienPopulation = calculateAlienPopulation(
    meat_demand,
    config.constants.alienMeatDemand
  );

  // Calculate stock market factors
  const stockDemand = calculateStockDemand(currentState.sympathizers);
  const stockSupply = calculateStockSupply(
    currentState.owned_stocks,
    currentState.maxStock
  );

  // Calculate price adjustments
  const priceAdjustment = calculatePriceAdjustment(
    meat_demand,
    currentState.meat,
    stockDemand,
    stockSupply
  );

  // Generate random adjustment
  const randomAdjustment = generateRandomAdjustment();

  // Calculate final prices
  const meat_price = calculateMeatPrice(
    config.basePrices.meat,
    priceAdjustment,
    randomAdjustment
  );

  const stock_price = calculateStockPrice(
    config.basePrices.stock,
    priceAdjustment,
    randomAdjustment
  );

  return {
    meat_demand,
    alienPopulation,
    meat_price,
    stock_price,
    priceAdjustment,
    randomAdjustment,
  };
}
