/**
 * NATS JetStream key-value adapter for PURISTA config values.
 *
 * JetStream must be enabled. Values are encoded with `JSONCodec`; use
 * tenant-aware keys and configure NATS credentials through connection options or
 * the runtime environment.
 *
 * @example
 * ```typescript
 * const store = new NatsConfigStore({
 *   servers: 'nats://localhost:4222',
 *   keyValueStoreName: 'purista-config-store',
 * })
 *
 * const config = await store.getConfig('tenant.acme.prod.app.features')
 * ```
 *
 * @module
 */
export * from './NatsConfigStore.impl.js'
export * from './types/index.js'
export * from './version.js'
