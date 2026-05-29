import type { Encoder } from '../types/Encoder.js'

/**
 * Default JSON payload encoder for AMQP messages.
 *
 * Values are serialized with `JSON.stringify` and parsed with `JSON.parse`.
 * This does not encrypt or redact payloads.
 */
export const jsonEncoder: Encoder = {
	'application/json': {
		encode: async <T>(input: T) => Buffer.from(JSON.stringify(input)),
		decode: async <T>(input: Buffer) => JSON.parse(input.toString()) as T,
	},
}
