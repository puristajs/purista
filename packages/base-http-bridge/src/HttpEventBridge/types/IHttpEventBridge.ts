import type { EBMessage, EventBridgeBaseClass } from '@purista/core'
import type { HttpEventBridgeConfig } from './HttpEventBridgeConfig.js'

export type IHttpEventBridge = {
	emitMessage: (message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>) => Promise<Readonly<EBMessage>>
	isHealthy: () => Promise<boolean>
} & EventBridgeBaseClass<HttpEventBridgeConfig>
