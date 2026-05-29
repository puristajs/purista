/**
 * Redis adapter for PURISTA state values.
 *
 * Values are stored as JSON strings in Redis and no local value cache is added.
 * Use tenant-aware key prefixes, minimize sensitive state, and configure
 * authenticated/TLS Redis endpoints for shared environments.
 *
 * @example
 * ```typescript
 * const store = new RedisStateStore({
 *   config: { url: 'redis://localhost:6379' },
 * })
 *
 * await store.setState('tenant:acme:prod:cart:session-123', { step: 'shipping' })
 * const state = await store.getState('tenant:acme:prod:cart:session-123')
 * ```
 *
 * @module
 */
export * from './RedisStateStore.impl.js'
export * from './types.js'
export * from './version.js'
