import { createCipheriv, randomBytes } from 'node:crypto'

import { ALGORITHM, BLOCK_SIZE_BYTES } from './constants.js'
import type { EncryptInput } from './types/EncryptInput.js'

/**
 * Encrypts text with AES-256-GCM using an Infisical project key.
 *
 * The returned `ciphertext`, `iv`, and `tag` are base64 encoded. Treat both the
 * input text and key as sensitive.
 */
export const encrypt = (input: EncryptInput) => {
	const { text, secret } = input
	const iv = randomBytes(BLOCK_SIZE_BYTES)
	const cipher = createCipheriv(ALGORITHM, secret, iv)

	let ciphertext = cipher.update(text, 'utf8', 'base64')
	ciphertext += cipher.final('base64')
	return {
		ciphertext,
		iv: iv.toString('base64'),
		tag: cipher.getAuthTag().toString('base64'),
	}
}
