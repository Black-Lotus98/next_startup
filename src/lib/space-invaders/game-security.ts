import type { GameState } from '@/types/space-invaders/game.types';
import { calculateEconomy } from './game-engine/economy-engine';
import gameConfigData from '@/data/space-invaders/game-config.json';
import type { GameConfig } from '@/types/space-invaders/game.types';

const gameConfig = gameConfigData as GameConfig;

/**
 * Security utilities for game state validation and anti-cheat
 */

/**
 * Generates a checksum/hash for game state
 * Used to detect tampering
 */
export function generateStateChecksum(gameState: GameState): string {
  // Create a hash from critical game values
  const criticalValues = [
    gameState.meat,
    gameState.xeno_matter,
    gameState.owned_stocks,
    gameState.meat_demand,
    gameState.meat_price,
    gameState.stock_price,
    gameState.year,
    gameState.alienPopulation,
  ].join('|');

  // Simple hash function (for production, use crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < criticalValues.length; i++) {
    const char = criticalValues.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Add a secret salt (in production, use environment variable)
  const salt = 'SPACE_INVADERS_SECRET_2024';
  return btoa(`${hash}|${salt}`).substring(0, 16);
}

/**
 * Validates game state integrity
 * Checks if values are within reasonable bounds
 */
export function validateGameStateIntegrity(gameState: GameState): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate numeric ranges
  if (gameState.meat < 0) errors.push('Meat cannot be negative');
  if (gameState.xeno_matter < 0) errors.push('Xeno matter cannot be negative');
  if (gameState.owned_stocks < 0) errors.push('Owned stocks cannot be negative');
  if (gameState.owned_stocks > gameState.maxStock) {
    errors.push('Owned stocks exceed maximum');
  }
  if (gameState.year < 1400 || gameState.year > 3000) {
    errors.push('Year is out of valid range');
  }
  if (gameState.meat_price < 0 || gameState.meat_price > 1000) {
    errors.push('Meat price is unrealistic');
  }
  if (gameState.stock_price < 0 || gameState.stock_price > 1000) {
    errors.push('Stock price is unrealistic');
  }

  // Validate relationships
  if (gameState.meat_demand > gameState.meat * 2) {
    errors.push('Meat demand is unrealistically high');
  }

  // Validate population values
  if (gameState.alienPopulation < 0) {
    errors.push('Alien population cannot be negative');
  }
  if (gameState.sympathizers < 0 || gameState.sympathizers > 100) {
    errors.push('Sympathizers out of valid range');
  }
  if (gameState.rebelHumans < 0 || gameState.rebelHumans > 100) {
    errors.push('Rebel humans out of valid range');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates state transitions
 * Ensures changes are legal and within expected bounds
 */
export function validateStateTransition(
  previousState: GameState,
  newState: GameState
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for impossible jumps
  const maxYearIncrease = 10;
  if (newState.year - previousState.year > maxYearIncrease) {
    errors.push(`Year cannot increase by more than ${maxYearIncrease}`);
  }

  // Check for impossible resource changes
  const maxResourceChange = previousState.xeno_matter * 10;
  if (Math.abs(newState.xeno_matter - previousState.xeno_matter) > maxResourceChange) {
    errors.push('Xeno matter change is too large');
  }

  // Validate economy calculations
  const expectedEconomy = calculateEconomy(
    {
      meat: newState.meat,
      sympathizers: newState.sympathizers,
      owned_stocks: newState.owned_stocks,
      maxStock: newState.maxStock,
    },
    gameConfig
  );

  // Allow small floating point differences
  const priceTolerance = 0.1;
  if (Math.abs(newState.meat_price - expectedEconomy.meat_price) > priceTolerance) {
    errors.push('Meat price does not match calculated economy');
  }
  if (Math.abs(newState.stock_price - expectedEconomy.stock_price) > priceTolerance) {
    errors.push('Stock price does not match calculated economy');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes game state to remove any tampered values
 * Recalculates economy and fixes invalid values
 */
export function sanitizeGameState(gameState: GameState): GameState {
  // Recalculate economy to fix tampered prices
  const economy = calculateEconomy(
    {
      meat: gameState.meat,
      sympathizers: gameState.sympathizers,
      owned_stocks: gameState.owned_stocks,
      maxStock: gameState.maxStock,
    },
    gameConfig
  );

  // Clamp values to valid ranges
  const sanitized: GameState = {
    ...gameState,
    // Fix prices
    meat_price: economy.meat_price,
    stock_price: economy.stock_price,
    meat_demand: economy.meat_demand,
    alienPopulation: economy.alienPopulation,
    priceAdjustment: economy.priceAdjustment,
    randomAdjustment: economy.randomAdjustment,
    
    // Clamp negative values
    meat: Math.max(0, gameState.meat),
    xeno_matter: Math.max(0, gameState.xeno_matter),
    owned_stocks: Math.max(0, Math.min(gameState.owned_stocks, gameState.maxStock)),
    
    // Clamp population
    sympathizers: Math.max(0, Math.min(100, gameState.sympathizers)),
    rebelHumans: Math.max(0, Math.min(100, gameState.rebelHumans)),
    
    // Clamp year
    year: Math.max(1400, Math.min(3000, gameState.year)),
  };

  return sanitized;
}
