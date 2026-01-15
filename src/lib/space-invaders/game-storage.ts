'use client';

import type { GameState } from '@/types/space-invaders/game.types';
import {
  validateGameStateIntegrity,
  sanitizeGameState,
  generateStateChecksum,
} from './game-security';

/**
 * Repository Pattern - Handles all persistence logic
 * Uses server-side API for secure storage (primary)
 * Falls back to localStorage with validation (secondary)
 */

const STORAGE_KEY = 'space-invaders-game-data';
const CHECKSUM_KEY = 'space-invaders-game-checksum';

/**
 * Saves game state to server API (primary) or localStorage (fallback)
 */
export async function saveGameState(gameState: GameState): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  // Validate state before saving
  const validation = validateGameStateIntegrity(gameState);
  if (!validation.isValid) {
    console.warn('Invalid game state detected, sanitizing:', validation.errors);
    const sanitized = sanitizeGameState(gameState);
    return saveGameState(sanitized);
  }

  try {
    // Try server-side storage first
    const response = await fetch('/api/game/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: gameState }),
    });

    if (response.ok) {
      return true;
    }

    // Fallback to localStorage with checksum
    const serialized = JSON.stringify(gameState);
    const checksum = generateStateChecksum(gameState);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(CHECKSUM_KEY, checksum);
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    
    // Fallback to localStorage
    try {
      const serialized = JSON.stringify(gameState);
      const checksum = generateStateChecksum(gameState);
      localStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(CHECKSUM_KEY, checksum);
      return true;
    } catch (localError) {
      console.error('Failed to save to localStorage:', localError);
      return false;
    }
  }
}

/**
 * Loads game state from server API (primary) or localStorage (fallback)
 * SSR-safe with error handling and tamper detection
 */
export async function loadGameState(): Promise<GameState | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Try server-side storage first
    const response = await fetch('/api/game/state', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.state) {
        // Validate integrity
        const validation = validateGameStateIntegrity(data.state);
        if (!validation.isValid) {
          console.warn('Server state validation failed, sanitizing:', validation.errors);
          return sanitizeGameState(data.state);
        }
        return data.state;
      }
    }

    // Fallback to localStorage with checksum validation
    const serialized = localStorage.getItem(STORAGE_KEY);
    const storedChecksum = localStorage.getItem(CHECKSUM_KEY);
    
    if (!serialized) {
      return null;
    }

    const gameState = JSON.parse(serialized) as GameState;
    
    // Validate structure
    if (!isValidGameState(gameState)) {
      console.warn('Loaded game state structure is invalid');
      return null;
    }

    // Validate checksum (detect tampering)
    const currentChecksum = generateStateChecksum(gameState);
    if (storedChecksum && storedChecksum !== currentChecksum) {
      console.warn('Game state checksum mismatch - possible tampering detected');
      // Sanitize tampered state
      return sanitizeGameState(gameState);
    }

    // Validate integrity
    const validation = validateGameStateIntegrity(gameState);
    if (!validation.isValid) {
      console.warn('Game state integrity check failed, sanitizing:', validation.errors);
      return sanitizeGameState(gameState);
    }

    return gameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Clears game state from server API and localStorage
 */
export async function clearGameState(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Clear server-side storage
    await fetch('/api/game/state', {
      method: 'DELETE',
      credentials: 'include',
    }).catch(() => {
      // Ignore errors, continue with localStorage cleanup
    });

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CHECKSUM_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear game state:', error);
    return false;
  }
}

/**
 * Validates if an object is a valid GameState
 */
function isValidGameState(obj: unknown): obj is GameState {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const state = obj as Partial<GameState>;

  // Check required numeric fields
  const requiredNumericFields: (keyof GameState)[] = [
    'meat',
    'xeno_matter',
    'owned_stocks',
    'alienPopulation',
    'sympathizers',
    'rebelHumans',
    'meat_demand',
    'meat_price',
    'stock_price',
    'year',
  ];

  return requiredNumericFields.every(
    (field) => typeof state[field] === 'number'
  );
}
