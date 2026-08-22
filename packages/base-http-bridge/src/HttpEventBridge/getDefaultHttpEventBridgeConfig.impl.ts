import type { Complete, EventBridgeConfig } from '@purista/core/adapter'

import type { HttpEventBridgeConfig } from './types/HttpEventBridgeConfig.js'

/**
 * Runs the getDefaultHttpEventBridgeConfig helper exported by @purista/base-http-bridge.
 * Start the bridge before registering services and stop it during graceful shutdown.
 * Expose only schemas and metadata that are safe for clients to inspect.
 */
/**
 * Returns default HTTP event bridge settings shared by sidecar-based bridges.
 */
export const getDefaultHttpEventBridgeConfig = (): EventBridgeConfig<Omit<HttpEventBridgeConfig, 'serve'>> => {
	const config: Complete<Omit<HttpEventBridgeConfig, 'serve'>> = {
		name: 'HttpEventBridge',
		serverHost: '127.0.0.1',
		serverPort: 8080,
		apiPrefix: '/api',
		enableRestApiExpose: true,
		pathPrefix: 'purista',
		subscriptionPayloadAsCloudEvent: false,
		commandPayloadAsCloudEvent: false,
		enableHttpCompression: true,
	}

	return config
}
