import type { GameState, GameConfig } from '@/types/space-invaders/game.types';
import { getRandomValue } from '../game-utils';
import { calculateEconomy } from './economy-engine';

/**
 * Factory Pattern - Creates initial game state
 * Separates state creation logic from state management
 */

/**
 * Creates initial game state with all calculations
 */
export function createInitialGameState(config: GameConfig): GameState {
  // Generate random initial values
  const sympathizers = getRandomValue(
    config.ranges.sympathizers.min,
    config.ranges.sympathizers.max
  );

  const rebelHumans = getRandomValue(
    config.ranges.rebelHumans.min,
    config.ranges.rebelHumans.max
  );

  const meatMultiplier = getRandomValue(
    config.ranges.meat.min,
    config.ranges.meat.max
  );
  const meat = meatMultiplier * 1000;

  // Calculate economy
  const economy = calculateEconomy(
    {
      meat,
      sympathizers,
      owned_stocks: 0,
      maxStock: config.constants.maxStock,
    },
    config
  );

  // Build initial state
  const initialState: GameState = {
    // Resources
    meat,
    xeno_matter: config.constants.initialXenoMatter,
    owned_stocks: 0,
    maxStock: config.constants.maxStock,

    // Population
    alienPopulation: economy.alienPopulation,
    sympathizers,
    rebelHumans,
    scientists: config.constants.initialScientists,

    // Economy
    meat_demand: economy.meat_demand,
    meat_price: economy.meat_price,
    stock_price: economy.stock_price,
    base_meat_price: config.basePrices.meat,
    base_stock_price: config.basePrices.stock,
    priceAdjustment: economy.priceAdjustment,
    randomAdjustment: economy.randomAdjustment,

    // Taxes
    income_tax: config.taxes.income,
    country_tax: config.taxes.country,
    sales_tax: config.taxes.sales,

    // Demographics
    numberOfDeaths: 0,
    numberOfBirths: 0,
    deathRate: config.rates.death,
    birthRate: config.rates.birth,

    // Game progression
    year: config.constants.initialYear,
    famine: false,
    festival: false,

    // Territories
    south_america: config.territories.south_america,
    north_america: config.territories.north_america,
    europe: config.territories.europe,
    asia: config.territories.asia,
    africa: config.territories.africa,
    oceania: config.territories.oceania,
    antarctica: config.territories.antarctica,
  };

  return initialState;
}
