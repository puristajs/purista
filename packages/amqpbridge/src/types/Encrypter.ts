import type { EncryptFunctions } from './EncryptFunctions.js'

/**
 * Map of content-encoding to encryption implementation.
 * Example key: `utf-8`.
 */
export type Encrypter = Record<string, EncryptFunctions>
