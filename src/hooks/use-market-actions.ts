'use client';

import { useGameState } from './use-game-state';
import { useCallback } from 'react';
import { formatNumber } from '@/lib/space-invaders/game-utils';

/**
 * Hook for market actions (buy/sell meat and stocks)
 */
export function useMarketActions() {
  const { gameState, updateGameState } = useGameState();

  /**
   * Buy meat with xeno matter
   */
  const buyMeat = useCallback(
    (amount: number): { success: boolean; message: string } => {
      if (amount <= 0) {
        return { success: false, message: 'Amount must be greater than 0' };
      }

      // Calculate cost (price per 1000 kg, so divide by 1000)
      const cost = (gameState.meat_price / 1000) * amount;

      if (cost > gameState.xeno_matter) {
        return {
          success: false,
          message: `Insufficient xeno matter. You need ${formatNumber(cost, 2)} but have ${formatNumber(gameState.xeno_matter)}`,
        };
      }

      // Update state
      updateGameState({
        meat: gameState.meat + amount,
        xeno_matter: gameState.xeno_matter - cost,
      });

      return {
        success: true,
        message: `Bought ${formatNumber(amount)} kg of meat for ${formatNumber(cost, 2)} xeno matter`,
      };
    },
    [gameState, updateGameState]
  );

  /**
   * Sell meat for xeno matter
   */
  const sellMeat = useCallback(
    (amount: number): { success: boolean; message: string } => {
      if (amount <= 0) {
        return { success: false, message: 'Amount must be greater than 0' };
      }

      if (amount > gameState.meat) {
        return {
          success: false,
          message: `Insufficient meat. You have ${formatNumber(gameState.meat)} kg`,
        };
      }

      // Calculate revenue (price per 1000 kg, so divide by 1000)
      const revenue = (gameState.meat_price / 1000) * amount;

      // Update state
      updateGameState({
        meat: gameState.meat - amount,
        xeno_matter: gameState.xeno_matter + revenue,
      });

      return {
        success: true,
        message: `Sold ${formatNumber(amount)} kg of meat for ${formatNumber(revenue, 2)} xeno matter`,
      };
    },
    [gameState, updateGameState]
  );

  /**
   * Buy stocks with xeno matter
   */
  const buyStocks = useCallback(
    (amount: number): { success: boolean; message: string } => {
      if (amount <= 0) {
        return { success: false, message: 'Amount must be greater than 0' };
      }

      if (gameState.owned_stocks + amount > gameState.maxStock) {
        return {
          success: false,
          message: `Cannot exceed maximum stocks. You can buy ${gameState.maxStock - gameState.owned_stocks} more stocks`,
        };
      }

      const cost = gameState.stock_price * amount;

      if (cost > gameState.xeno_matter) {
        return {
          success: false,
          message: `Insufficient xeno matter. You need ${formatNumber(cost, 2)} but have ${formatNumber(gameState.xeno_matter)}`,
        };
      }

      // Update state
      updateGameState({
        owned_stocks: gameState.owned_stocks + amount,
        xeno_matter: gameState.xeno_matter - cost,
      });

      return {
        success: true,
        message: `Bought ${formatNumber(amount)} stocks for ${formatNumber(cost, 2)} xeno matter`,
      };
    },
    [gameState, updateGameState]
  );

  /**
   * Sell stocks for xeno matter
   */
  const sellStocks = useCallback(
    (amount: number): { success: boolean; message: string } => {
      if (amount <= 0) {
        return { success: false, message: 'Amount must be greater than 0' };
      }

      if (amount > gameState.owned_stocks) {
        return {
          success: false,
          message: `Insufficient stocks. You have ${formatNumber(gameState.owned_stocks)} stocks`,
        };
      }

      const revenue = gameState.stock_price * amount;

      // Update state
      updateGameState({
        owned_stocks: gameState.owned_stocks - amount,
        xeno_matter: gameState.xeno_matter + revenue,
      });

      return {
        success: true,
        message: `Sold ${formatNumber(amount)} stocks for ${formatNumber(revenue, 2)} xeno matter`,
      };
    },
    [gameState, updateGameState]
  );

  return {
    buyMeat,
    sellMeat,
    buyStocks,
    sellStocks,
    gameState,
  };
}
