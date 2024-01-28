/**
 * Package for using a MQTT broker like rabbitMQ as event bridge.
 *
 * Example usage:
 *
 * @example
 * ```typescript
 * import { MqttBridge } from '@purista/mqttbridge'
 *
 * // create and init our eventbridge
 * const eventBridge = new MqttBridge()
 * await eventBridge.start()
 *
 * ```
 *
 * @module
 */
export * from './getDefaultMqttBridgeConfig.impl.js'
export * from './handler/index.js'
export * from './MqttEventBridge.js'
export * from './msToSec.impl.js'
export * from './topic/index.js'
export * from './types/index.js'
export * from './version.js'
