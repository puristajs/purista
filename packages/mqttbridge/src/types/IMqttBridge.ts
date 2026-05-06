import type { EventBridgeBaseClass, PendingInvocationRegistry } from '@purista/core'
import type { MqttClient } from 'mqtt'
import type { MqttBridgeConfig } from './MqttBridgeConfig.js'

export type IMqttBridge = {
	client: MqttClient | undefined
	pendingInvocations: PendingInvocationRegistry<unknown>
} & EventBridgeBaseClass<MqttBridgeConfig>
