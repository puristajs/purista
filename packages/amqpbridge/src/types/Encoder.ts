import type { EncoderFunctions } from './EncoderFunctions.js'

/**
 * Map of content-type to codec implementation.
 * Example key: `application/json`.
 */
export type Encoder = Record<string, EncoderFunctions>
