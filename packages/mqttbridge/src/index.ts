/**
 * Package for using a MQTT broker like rabbitMQ as event bridge.
 *
 * Example usage:
 *
 * @example ```typescript
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
export * from './AsyncClient'
export * from './getDefaultMqttBridgeConfig.impl'
export * from './handler'
export * from './MqttEventBridge'
export * from './msToSec.impl'
export * from './topic'
export * from './types'
