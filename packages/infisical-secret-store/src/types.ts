import type { ClientConfig } from './InfisicalClient/types/ClientConfig.js'

/**
 * Configuration for `InfisicalSecretStore`.
 *
 * This is the Infisical HTTP client configuration plus PURISTA store options
 * supplied through `StoreBaseConfig`. The `bearerToken` is required by
 * `ClientConfig`; load it from runtime secret management and never commit a real
 * token.
 */
export type InfisicalSecretConfig = ClientConfig
