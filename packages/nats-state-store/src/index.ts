/**
 * NATS JetStream key-value adapter for PURISTA state values.
 *
 * JetStream must be enabled. Values are encoded with `JSONCodec`; use
 * tenant-aware keys, minimize sensitive state, and configure NATS credentials
 * through connection options or the runtime environment.
 *
 * @example
 * ```typescript
 * const store = new NatsStateStore({
 *   servers: 'nats://localhost:4222',
 *   keyValueStoreName: 'purista-state-store',
 * })
 *
 * const state = await store.getState('tenant.acme.prod.cart.session-123')
 * ```
 *
 * @module
 */
export * from './NatsStateStore.impl.js'
export * from './types/index.js'
export * from './version.js'
