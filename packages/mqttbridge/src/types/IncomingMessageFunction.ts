import type { EBMessage } from '@purista/core/adapter'
import type { IPublishPacket } from 'mqtt'
import type { IMqttBridge } from './IMqttBridge.js'

/**
 * MQTT message handler bound to an {@link IMqttBridge} instance.
 *
 * Handlers receive the decoded PURISTA message and the original MQTT packet so
 * they can use user properties, correlation data, and subscription identifiers.
 */
export type IncomingMessageFunction = (this: IMqttBridge, payload: EBMessage, packet: IPublishPacket) => Promise<void>
