/**
 * Redis adapter for PURISTA config values.
 *
 * Values are stored as JSON strings in Redis and no local value cache is added.
 * Use tenant-aware key prefixes and authenticated/TLS Redis endpoints for shared
 * environments.
 *
 * @example
 * ```typescript
 * const store = new RedisConfigStore({
 *   config: { url: 'redis://localhost:6379' },
 * })
 *
 * await store.setConfig('tenant:acme:prod:app:features', { checkout: true })
 * const config = await store.getConfig('tenant:acme:prod:app:features')
 * ```
 *
 * @module
 */
export * from './RedisConfigStore.impl.js'
export * from './types.js'
export * from './version.js'
