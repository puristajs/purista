import type { Encrypter } from '../types/index.js'

export const plainEncrypter: Encrypter = {
	'utf-8': {
		encrypt: async input => input,
		decrypt: async input => input,
	},
}
