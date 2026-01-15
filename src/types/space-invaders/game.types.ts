export interface GameState {
  // Resources
  meat: number;
  xeno_matter: number;
  owned_stocks: number;
  maxStock: number;

  // Population
  alienPopulation: number;
  sympathizers: number;
  rebelHumans: number;
  scientists: number;

  // Economy
  meat_demand: number;
  meat_price: number;
  stock_price: number;
  base_meat_price: number;
  base_stock_price: number;
  priceAdjustment: number;
  randomAdjustment: number;

  // Taxes
  income_tax: number;
  country_tax: number;
  sales_tax: number;

  // Demographics
  numberOfDeaths: number;
  numberOfBirths: number;
  deathRate: number;
  birthRate: number;

  // Game progression
  year: number;
  famine: boolean;
  festival: boolean;

  // Territories
  south_america: number;
  north_america: number;
  europe: number;
  asia: number;
  africa: number;
  oceania: number;
  antarctica: number;
}

export interface GameConfig {
  basePrices: {
    meat: number;
    stock: number;
  };
  ranges: {
    sympathizers: { min: number; max: number };
    rebelHumans: { min: number; max: number };
    meat: { min: number; max: number };
    meatDemandPercentage: { min: number; max: number };
  };
  constants: {
    alienMeatDemand: number;
    initialXenoMatter: number;
    initialScientists: number;
    initialYear: number;
    maxStock: number;
  };
  taxes: {
    income: number;
    country: number;
    sales: number;
  };
  rates: {
    death: number;
    birth: number;
  };
  territories: {
    south_america: number;
    north_america: number;
    europe: number;
    asia: number;
    africa: number;
    oceania: number;
    antarctica: number;
  };
}

export interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
}

