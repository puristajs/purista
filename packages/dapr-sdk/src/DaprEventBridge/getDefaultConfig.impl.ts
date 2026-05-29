import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl.js'

/**
 * Runs the getDefaultConfig helper exported by @purista/dapr-sdk.
 */
/**
 * Returns default Dapr event bridge settings.
 *
 * Defaults match Dapr sidecar conventions and expose HTTP command projections
 * under `/api` while keeping internal PURISTA routes under `/purista`.
 */
export const getDefaultConfig = () => {
	const serverPort = process.env.APP_PORT ? Number.parseInt(process.env.APP_PORT, 10) : 8080

	return {
		name: 'DaprEventBridge',
		serverHost: process.env.SERVER_HOST ?? '127.0.0.1',
		serverPort,
		pathPrefix: 'purista',
		apiPrefix: 'api',
		enableRestApiExpose: true,
		subscriptionPayloadAsCloudEvent: true,
		commandPayloadAsCloudEvent: false,
		clientConfig: getDefaultClientConfig(),
	}
}
