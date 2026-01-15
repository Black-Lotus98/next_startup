/**
 * Utility functions for game calculations
 * Pure functions - no side effects
 */

/**
 * Generates a random integer between min and max (inclusive)
 */
export function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max
 */
export function getRandomFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Formats a number to fixed decimal places
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toFixed(decimals);
}

/**
 * Calculates percentage of a value
 */
export function calculatePercentage(value: number, percentage: number): number {
  return (percentage / 100) * value;
}
