import { getRandomFloat } from '../game-utils';

/**
 * Pure calculation functions for game logic
 * No side effects - easily testable
 */

/**
 * Calculates meat demand based on total meat and percentage
 */
export function calculateMeatDemand(
  totalMeat: number,
  demandPercentage: number
): number {
  return (demandPercentage / 100) * totalMeat;
}

/**
 * Calculates alien population based on meat demand
 */
export function calculateAlienPopulation(
  meatDemand: number,
  alienMeatDemandPerAlien: number
): number {
  return meatDemand / alienMeatDemandPerAlien;
}

/**
 * Calculates price adjustment based on supply and demand
 */
export function calculatePriceAdjustment(
  demand: number,
  supply: number,
  stockDemand?: number,
  stockSupply?: number
): number {
  let adjustment = 1;

  // Stock market adjustment
  if (stockDemand && stockSupply && stockDemand > stockSupply) {
    adjustment = 1.1;
  }

  // Meat shortage adjustment
  if (demand > supply) {
    adjustment = Math.max(adjustment, 1.2);
  }

  return adjustment;
}

/**
 * Calculates meat price with all factors
 */
export function calculateMeatPrice(
  basePrice: number,
  priceAdjustment: number,
  randomAdjustment: number
): number {
  return basePrice * priceAdjustment * randomAdjustment;
}

/**
 * Calculates stock price with all factors
 */
export function calculateStockPrice(
  basePrice: number,
  priceAdjustment: number,
  randomAdjustment: number
): number {
  return basePrice * priceAdjustment * randomAdjustment;
}

/**
 * Generates random adjustment factor (0.9 to 1.1)
 */
export function generateRandomAdjustment(): number {
  return getRandomFloat(0.9, 1.1);
}

/**
 * Calculates stock demand based on sympathizers
 */
export function calculateStockDemand(sympathizers: number): number {
  return sympathizers / 1000;
}

/**
 * Calculates stock supply based on owned stocks and max
 */
export function calculateStockSupply(
  ownedStocks: number,
  maxStock: number
): number {
  return maxStock - ownedStocks;
}
