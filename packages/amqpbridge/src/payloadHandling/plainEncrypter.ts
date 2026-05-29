import type { Encrypter } from '../types/Encrypter.js'

/**
 * Default no-op encrypter that uses UTF-8 passthrough for payloads.
 *
 * This handler provides compatibility, not confidentiality. Replace it with an
 * application-specific encrypter before publishing sensitive payloads.
 */
export const plainEncrypter: Encrypter = {
	'utf-8': {
		encrypt: async input => input,
		decrypt: async input => input,
	},
}
