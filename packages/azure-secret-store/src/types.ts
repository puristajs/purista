import type { SecretClientOptions } from '@azure/keyvault-secrets'

/**
 * Azure Key Vault secret store configuration.
 *
 * Authentication is handled by `DefaultAzureCredential`; do not pass real
 * credentials through this object or include them in examples.
 */
export type AzureSecretStoreConfig = {
	/**
	 * HTTPS URL of the Azure Key Vault.
	 *
	 * @example
	 * ```typescript
	 * 'https://example-vault.vault.azure.net'
	 * ```
	 */
	vaultUrl: string
	/**
	 * Allow connections to self-signed / insecure endpoints (useful for local emulators).
	 * Never enable this in production.
	 */
	allowInsecureConnection?: boolean
	/**
	 * Additional options passed to the Azure `SecretClient`.
	 */
	options?: SecretClientOptions
}
