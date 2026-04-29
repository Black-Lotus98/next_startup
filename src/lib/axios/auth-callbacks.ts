'use client';

/**
 * Ports-and-adapters bridge between the Axios layer and Redux.
 *
 * Axios cannot import Redux dispatch (it lives outside the React tree).
 * Instead, the StoreProvider registers a callback here on mount.
 * When a token refresh fails, Axios calls triggerAuthFailure() —
 * Redux handles the rest without Axios knowing anything about it.
 */

type AuthFailureCallback = () => void;
let _onAuthFailure: AuthFailureCallback | null = null;

export function registerAuthFailureCallback(fn: AuthFailureCallback): void {
  _onAuthFailure = fn;
}

export function triggerAuthFailure(): void {
  _onAuthFailure?.();
}
