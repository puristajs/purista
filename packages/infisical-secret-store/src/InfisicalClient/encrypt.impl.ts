import { createCipheriv, randomBytes } from 'node:crypto'

import { ALGORITHM, BLOCK_SIZE_BYTES } from './constants'
import type { EncryptInput } from './types'

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
