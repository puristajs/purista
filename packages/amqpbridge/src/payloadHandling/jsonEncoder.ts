import type { Encoder } from '../types/index.js'

/**
 * The JSON encoder.
 * Encodes JSON/JavaScript object to the AMQP message payload format and Decodes the AMQP message payload to JSON/JavaScript object
 */
export const jsonEncoder: Encoder = {
  'application/json': {
    encode: async <T>(input: T) => Buffer.from(JSON.stringify(input)),
    decode: async <T>(input: Buffer) => JSON.parse(input.toString()) as T,
  },
}
