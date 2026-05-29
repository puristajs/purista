/**
 * Azure Key Vault adapter for PURISTA secret values.
 *
 * The store uses `DefaultAzureCredential` and caches reads in memory by default.
 * Use Key Vault-compatible, tenant-aware names and never log returned secret
 * values.
 *
 * @example
 * ```typescript
 * const store = new AzureSecretStore({
 *   vaultUrl: 'https://example-vault.vault.azure.net',
 *   cacheTtl: 30_000,
 * })
 *
 * const secret = await store.getSecret('acme-prod-payments-api-token')
 * ```
 *
 * @module
 */
export * from './AzureSecretStore.impl.js'
export * from './types.js'
export * from './version.js'
