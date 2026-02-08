/**
 * HashiCorp Vault store config
 */
export type VaultSecretStoreConfig = {
	/**
	 * Vault HTTP endpoint
	 * @example 'http://localhost:8200'
	 */
	endpoint: string
	/**
	 * Authentication token
	 */
	token: string
	/**
	 * Secret engine mount path
	 * @default 'secret'
	 */
	mount?: string
}
