/**
 * HashiCorp Vault KV v2 adapter for PURISTA secret values.
 *
 * The store caches reads in memory by default and writes values under the
 * configured KV mount using the field name `value`. Load Vault tokens from
 * runtime secret management and never log returned secret values.
 *
 * @example
 * ```typescript
 * const store = new VaultSecretStore({
 *   endpoint: 'https://vault.example.internal',
 *   token: process.env.VAULT_TOKEN ?? '',
 *   mount: 'secret',
 * })
 *
 * const secret = await store.getSecret('tenants/acme/prod/payments/api-token')
 * ```
 *
 * @module
 */
export * from './types.js'
export * from './VaultSecretStore.impl.js'
export * from './version.js'
