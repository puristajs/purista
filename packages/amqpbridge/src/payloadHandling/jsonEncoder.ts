import { Encoder } from '../types'

export const jsonEncoder: Encoder = {
  'application/json': {
    encode: async <T>(input: T) => Buffer.from(JSON.stringify(input)),
    decode: async <T>(input: Buffer) => JSON.parse(input.toString()) as T,
  },
}
