import type { Encrypter } from '../types'

export const plainEncrypter: Encrypter = {
  'utf-8': {
    encrypt: async (input) => input,
    decrypt: async (input) => input,
  },
}
