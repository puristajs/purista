/**
 * Input required to encrypt an Infisical secret field.
 */
export type EncryptInput = {
	/**
	 * Plaintext to encrypt.
	 *
	 * Do not log this value when it contains a secret name or secret value.
	 */
	text: string
	/**
	 * Project encryption key used for encryption.
	 *
	 * Treat this value as secret material.
	 */
	secret: string
}
