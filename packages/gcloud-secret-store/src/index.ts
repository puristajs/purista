/**
 * Google Secret Manager adapter for PURISTA secret values.
 *
 * The store uses Google Cloud client credentials and caches reads in memory by
 * default. Use Secret Manager-compatible, tenant-aware secret ids and never log
 * returned secret values.
 *
 * @example
 * ```typescript
 * const store = new GoogleSecretStore({
 *   project: 'projects/example-project',
 *   cacheTtl: 30_000,
 * })
 *
 * const secret = await store.getSecret('acme-prod-payments-api-token')
 * ```
 *
 * @module
 */
export * from './GoogleSecretStore.impl.js'
export * from './types.js'
export * from './version.js'
