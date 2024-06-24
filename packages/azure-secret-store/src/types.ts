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
	options?: SecretClientOptions
}
