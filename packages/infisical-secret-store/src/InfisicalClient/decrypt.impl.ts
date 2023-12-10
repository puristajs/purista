import { createDecipheriv } from 'node:crypto'

import { ALGORITHM } from './constants.js'
import type { DecryptInput } from './types/index.js'

export const decrypt = (input: DecryptInput) => {
  const { ciphertext, iv, tag, secret } = input
  const decipher = createDecipheriv(ALGORITHM, secret, Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(tag, 'base64'))

  let cleartext = decipher.update(ciphertext, 'base64', 'utf8')
  cleartext += decipher.final('utf8')

  return cleartext
}
