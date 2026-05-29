import type { EBMessage, EventBridgeBaseClass } from '@purista/core'
import type { HttpEventBridgeConfig } from './HttpEventBridgeConfig.js'

/**
 * Minimal bridge shape required by HTTP route handlers.
 *
 * Route helpers bind `this` to an event bridge instance so they can emit
 * follow-up events, read configuration, create spans and check health.
 */
export type IHttpEventBridge = {
	/**
	 * Emits an event message after command or subscription handling.
	 */
	emitMessage: (message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>) => Promise<Readonly<EBMessage>>
	/**
	 * Checks runtime health for `/healthz` responses.
	 */
	isHealthy: () => Promise<boolean>
} & EventBridgeBaseClass<HttpEventBridgeConfig>
