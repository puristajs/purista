/**
 * Input required to decrypt an Infisical encrypted field.
 */
export type DecryptInput = {
	/**
	 * Base64-encoded ciphertext returned by Infisical.
	 */
	ciphertext: string
	/**
	 * Base64-encoded initialization vector.
	 */
	iv: string
	/**
	 * Base64-encoded authentication tag.
	 */
	tag: string
	/**
	 * Project encryption key used for decryption.
	 *
	 * Treat this value as secret material.
	 */
	secret: string
}
