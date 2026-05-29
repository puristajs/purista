/**
 * Configuration for clients that call the local Dapr sidecar.
 */
export type DaprClientConfig = {
	/**
	 * Dapr HTTP API version.
	 * @default v1.0
	 */
	daprApiVersion: string
	/**
	 * Host location of the Dapr sidecar.
	 * @default http://127.0.0.1
	 */
	daprHost?: string
	/**
	 * Port of the Dapr sidecar.
	 * @default 3500.
	 */
	daprPort?: string

	/**
	 * The prefix to generate the app-ID of other services.
	 * @default `app-`
	 */
	appPrefix?: string

	/**
	 * API token used to authenticate with the Dapr sidecar.
	 *
	 * Do not log or expose this value.
	 * See https://docs.dapr.io/operations/security/api-token/.
	 */
	daprApiToken?: string

	/**
	 * If set to false, the HTTP client will not reuse the same connection for multiple requests.
	 * @default true
	 */
	isKeepAlive?: boolean

	/**
	 * Dapr Pub/Sub component name used for PURISTA event messages.
	 * @default pubsub
	 */
	pubSubName?: string
}
