import { createDecipheriv } from 'node:crypto'

import { ALGORITHM } from './constants.js'
import type { DecryptInput } from './types/DecryptInput.js'

/**
 * Decrypts an AES-256-GCM encrypted Infisical field.
 *
 * The returned plaintext may be a secret value or secret name; do not log it.
 */
export const decrypt = (input: DecryptInput) => {
	const { ciphertext, iv, tag, secret } = input
	const decipher = createDecipheriv(ALGORITHM, secret, Buffer.from(iv, 'base64'))
	decipher.setAuthTag(Buffer.from(tag, 'base64'))

	let cleartext = decipher.update(ciphertext, 'base64', 'utf8')
	cleartext += decipher.final('utf8')

	return cleartext
}
