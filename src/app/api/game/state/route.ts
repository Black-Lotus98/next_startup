import { NextRequest, NextResponse } from 'next/server';
import type { GameState } from '@/types/space-invaders/game.types';
import {
  validateGameStateIntegrity,
  sanitizeGameState,
  generateStateChecksum,
} from '@/lib/space-invaders/game-security';

/**
 * Server-side game state storage API
 * Provides secure storage that cannot be manipulated client-side
 */

// In-memory storage (in production, use database)
// Key: sessionId, Value: { state, checksum, timestamp }
const gameStateStore = new Map<
  string,
  { state: GameState; checksum: string; timestamp: number }
>();

// Cleanup old sessions (older than 24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

function cleanupOldSessions() {
  const now = Date.now();
  for (const [sessionId, data] of gameStateStore.entries()) {
    if (now - data.timestamp > SESSION_TIMEOUT) {
      gameStateStore.delete(sessionId);
    }
  }
}

/**
 * GET - Load game state
 */
export async function GET(request: NextRequest) {
  try {
    cleanupOldSessions();

    const sessionId = request.cookies.get('game-session-id')?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'No game session found' },
        { status: 404 }
      );
    }

    const stored = gameStateStore.get(sessionId);
    if (!stored) {
      return NextResponse.json(
        { error: 'Game session expired' },
        { status: 404 }
      );
    }

    // Validate checksum
    const currentChecksum = generateStateChecksum(stored.state);
    if (currentChecksum !== stored.checksum) {
      // State was tampered with, return sanitized version
      const sanitized = sanitizeGameState(stored.state);
      const newChecksum = generateStateChecksum(sanitized);
      gameStateStore.set(sessionId, {
        state: sanitized,
        checksum: newChecksum,
        timestamp: Date.now(),
      });
      return NextResponse.json({ state: sanitized, tampered: true });
    }

    return NextResponse.json({ state: stored.state });
  } catch (error) {
    console.error('Error loading game state:', error);
    return NextResponse.json(
      { error: 'Failed to load game state' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save game state
 */
export async function POST(request: NextRequest) {
  try {
    cleanupOldSessions();

    const body = await request.json();
    const gameState = body.state as GameState;
    const sessionId =
      request.cookies.get('game-session-id')?.value ||
      `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Validate state integrity
    const validation = validateGameStateIntegrity(gameState);
    if (!validation.isValid) {
      // Sanitize instead of rejecting
      const sanitized = sanitizeGameState(gameState);
      const checksum = generateStateChecksum(sanitized);
      gameStateStore.set(sessionId, {
        state: sanitized,
        checksum,
        timestamp: Date.now(),
      });

      const response = NextResponse.json({
        state: sanitized,
        warnings: validation.errors,
      });
      response.cookies.set('game-session-id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    // Generate checksum
    const checksum = generateStateChecksum(gameState);

    // Store state
    gameStateStore.set(sessionId, {
      state: gameState,
      checksum,
      timestamp: Date.now(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('game-session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Error saving game state:', error);
    return NextResponse.json(
      { error: 'Failed to save game state' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear game state
 */
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('game-session-id')?.value;
    if (sessionId) {
      gameStateStore.delete(sessionId);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('game-session-id');
    return response;
  } catch (error) {
    console.error('Error clearing game state:', error);
    return NextResponse.json(
      { error: 'Failed to clear game state' },
      { status: 500 }
    );
  }
}
