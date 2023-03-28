/**
 * Package for using a AMQP broker like rabbitMQ as event bridge.
 *
 *Example usage:
 *
 * @example ```typescript
 * import { AmqpBridge } from '@purista/amqpbridge'
 *
 * // create and init our eventbridge
 *   const eventBridge = new AmqpBridge(undefined)
 *   await eventBridge.start()
 *
 * ```
 *
 * @module
 */
export * from './AmqpBridge.impl'
export * from './deserializeOtpFromAmqpHeader.impl'
export * from './getDefaultConfig.impl'
export * from './serializeOtpForAmqpHeader.impl'
export * from './types'
export * from './version'
