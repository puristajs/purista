/**
 * Package for using a AMQP broker like rabbitMQ as event bridge.
 *
 *Example usage:
 *
 * @example ```typescript
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
export * from './AmqpBridge.impl.js'
export * from './deserializeOtpFromAmqpHeader.impl.js'
export * from './getDefaultConfig.impl.js'
export * from './serializeOtpForAmqpHeader.impl.js'
export * from './types/index.js'
export * from './version.js'
