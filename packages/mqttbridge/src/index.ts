/**
 * Package for using an MQTT broker as event bridge.
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
export { MqttBridge } from './MqttEventBridge.js'
export type { MqttBridgeConfig } from './types/MqttBridgeConfig.js'
