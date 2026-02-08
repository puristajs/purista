import type { Encrypter } from '../types/Encrypter.js'

/**
 * Default no-op encrypter that uses UTF-8 passthrough for payloads.
 */
export const plainEncrypter: Encrypter = {
	'utf-8': {
		encrypt: async input => input,
		decrypt: async input => input,
	},
}
