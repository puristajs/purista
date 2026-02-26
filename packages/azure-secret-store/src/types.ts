import type { SecretClientOptions } from '@azure/keyvault-secrets'

/**
 * Azure Key Vault store config
 */
export type AzureSecretStoreConfig = {
	/**
	 * The URL to reach the Azure Key Vault
	 * @example https://[KEY_VAULT_NAME].vault.azure.net
	 */
	vaultUrl: string
	/**
	 * Allow connections to self-signed / insecure endpoints (useful for local emulators).
	 * Never enable this in production.
	 */
	allowInsecureConnection?: boolean
	options?: SecretClientOptions
}
