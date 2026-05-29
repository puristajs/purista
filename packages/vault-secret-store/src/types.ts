/**
 * HashiCorp Vault KV v2 secret store configuration.
 */
export type VaultSecretStoreConfig = {
	/**
	 * Vault HTTP endpoint.
	 *
	 * @example
	 * ```typescript
	 * 'https://vault.example.internal'
	 * ```
	 */
	endpoint: string
	/**
	 * Vault authentication token.
	 *
	 * Prefer short-lived tokens from the runtime environment. Do not commit or log
	 * real token values.
	 */
	token: string
	/**
	 * KV v2 secret engine mount path. Leading and trailing slashes are normalized.
	 *
	 * @default 'secret'
	 */
	mount?: string
}
