export type DaprClientConfig = {
	/**
	 * The Dapr api version
	 * @default v1.0
	 */
	daprApiVersion: string
	/**
	 * Host location of the Dapr sidecar.
	 * @default 127.0.0.1
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
	 * API token to authenticate with Dapr.
	 * See https://docs.dapr.io/operations/security/api-token/.
	 */
	daprApiToken?: string

	/**
	 * If set to false, the HTTP client will not reuse the same connection for multiple requests.
	 * @default true
	 */
	isKeepAlive?: boolean

	/**
	 * The PubSub to be used for event messages
	 * @default pubsub
	 */
	pubSubName?: string
}
