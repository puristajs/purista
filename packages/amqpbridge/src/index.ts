/**
 * Package for using a AMQP broker like rabbitMQ as event bridge.
 *
 *Example usage:
 *
 * @example
 * ```typescript
 * import { AmqpBridge } from '@purista/amqpbridge'
 *
 * // create and init our eventbridge
 *   const eventBridge = new AmqpBridge()
 *   await eventBridge.start()
 *
 * ```
 *
 * @module
 */
export { AmqpBridge } from './AmqpBridge.impl.js'
export type { AmqpBridgeConfig } from './types/AmqpBridgeConfig.js'
export type { Encoder } from './types/Encoder.js'
export type { EncoderFunctions } from './types/EncoderFunctions.js'
export type { Encrypter } from './types/Encrypter.js'
export type { EncryptFunctions } from './types/EncryptFunctions.js'
