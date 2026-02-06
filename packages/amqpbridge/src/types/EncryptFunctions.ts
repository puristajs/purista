/**
 * Encrypt/decrypt contract for one content-encoding implementation.
 */
export type EncryptFunctions = {
	/** Encrypts a payload before it is sent to AMQP. */
	encrypt: (input: Buffer) => Promise<Buffer>
	/** Decrypts a payload after it is received from AMQP. */
	decrypt: (input: Buffer) => Promise<Buffer>
}
