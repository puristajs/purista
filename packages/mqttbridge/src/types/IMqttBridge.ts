import type { EventBridgeBaseClass, PendingInvocationRegistry } from '@purista/core/adapter'
import type { MqttClient } from 'mqtt'
import type { MqttBridgeConfig } from './MqttBridgeConfig.js'

/**
 * Internal receiver shape used by exported MQTT helper functions.
 *
 * Consumers normally use {@link MqttBridge}; this type is exported so topic and
 * handler helpers can be bound with a typed `this` context.
 */
export type IMqttBridge = {
	/** Active MQTT client, if the bridge has been started. */
	client: MqttClient | undefined
	/** Registry for command invocations awaiting correlated responses. */
	pendingInvocations: PendingInvocationRegistry<unknown>
} & EventBridgeBaseClass<MqttBridgeConfig>
