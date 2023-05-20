/**
 * Package for using a MQTT broker like rabbitMQ as event bridge.
 *
 * Example usage:
 *
 * @example ```typescript
 * import { NatsBridge } from '@purista/natsbridge'
 *
 * // create and init our eventbridge
 * const eventBridge = new NatsBridge()
 * await eventBridge.start()
 *
 * ```
 *
 * @module
 */
export * from './getDefaultNatsBridgeConfig'
export * from './getQueueGroupName.impl'
export * from './NatsBridge'
export * from './topic'
export * from './types'
export * from './version'
