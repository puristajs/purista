import type { EBMessageId, EventBridgeBaseClass, PendigInvocation } from '@purista/core'
import type { MqttClient } from 'mqtt'
import type { MqttBridgeConfig } from './MqttBridgeConfig.js'

export type IMqttBridge = {
	client: MqttClient | undefined
	pendingInvocations: Map<EBMessageId, PendigInvocation>
} & EventBridgeBaseClass<MqttBridgeConfig>
