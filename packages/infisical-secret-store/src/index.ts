/**
 * Infisical adapter for PURISTA secret values.
 *
 * The store uses an Infisical service token and caches reads in memory by
 * default. Load tokens from runtime secret management and never log token data,
 * project keys, or returned secret values.
 *
 * @example
 * ```typescript
 * const store = new InfisicalSecretStore({
 *   bearerToken: process.env.INFISICAL_TOKEN ?? '',
 *   baseUrl: 'https://app.infisical.com',
 *   cacheTtl: 30_000,
 * })
 *
 * const secret = await store.getSecret('ACME_PROD_PAYMENTS_API_TOKEN')
 * ```
 *
 * @module
 */
export * from './InfisicalClient/index.js'
export * from './InfisicalSecretStore.impl.js'
export * from './types.js'
export * from './version.js'
