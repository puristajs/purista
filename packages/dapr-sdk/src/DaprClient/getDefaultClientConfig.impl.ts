import { DAPR_API_VERSION, DEFAULT_DAPR_HOST, DEFAULT_DAPR_PORT } from '../types/constants.js'

/**
 * Runs the getDefaultClientConfig helper exported by @purista/dapr-sdk.
 */
/**
 * Returns default Dapr sidecar client settings.
 *
 * `DAPR_HOST`, `DAPR_HTTP_PORT` and the Dapr API token can be supplied through
 * configuration or environment depending on the deployment.
 */
export const getDefaultClientConfig = () => {
	return {
		daprHost: process.env.DAPR_HOST ?? DEFAULT_DAPR_HOST,
		daprPort: process.env.DAPR_HTTP_PORT ?? DEFAULT_DAPR_PORT,
		daprApiToken: undefined,
		isKeepAlive: true,
		pubSubName: 'pubsub',
		daprApiVersion: DAPR_API_VERSION,
		appPrefix: 'app-',
	}
}
