import type {
	Command,
	CommandResponse,
	EBMessage,
	EBMessageAddress,
	HttpExposedServiceMeta,
} from '@purista/core/adapter'

/**
 * Adapter contract between {@link HttpEventBridge} and a sidecar or platform HTTP API.
 *
 * Implementations encode runtime-specific URL conventions, for example Dapr's
 * `/v1.0/invoke/{app-id}/method/...` command path and Pub/Sub publish endpoint.
 */
export interface HttpEventBridgeClient {
	/**
	 * Generates the internal POST path for a full PURISTA command message.
	 *
	 * @param address - Receiver service and command address.
	 * @returns Relative URL path hosted by the receiving service.
	 */
	getInternalPathForCommand: (address: EBMessageAddress) => string

	/**
	 * Generates the public HTTP projection path declared by command metadata.
	 *
	 * This route accepts the command's exposed payload and parameters, not the
	 * full PURISTA command envelope.
	 *
	 * @param address - Receiver service and command address.
	 * @param metadata - HTTP exposure metadata from the command definition.
	 * @returns Relative URL path for the public command endpoint.
	 */
	getApiPathForCommand: (address: EBMessageAddress, metadata: HttpExposedServiceMeta) => string

	/**
	 * Generates the internal POST path for subscription delivery.
	 *
	 * Depending on bridge configuration, the route receives either an `EBMessage`
	 * payload or a CloudEvent whose `data` contains the message.
	 *
	 * @param address - Subscriber service and subscription address.
	 * @returns Relative URL path hosted by the subscriber service.
	 */
	getInternalPathForSubscription: (address: EBMessageAddress) => string

	/**
	 * Invokes a command through the sidecar/platform HTTP API.
	 *
	 * @param command - Full PURISTA command envelope.
	 * @param headers - Optional HTTP headers, including propagated tracing headers.
	 * @param timeout - Optional timeout in milliseconds.
	 * @returns Full PURISTA command response envelope.
	 */
	invoke: (command: Command, headers?: Record<string, string>, timeout?: number) => Promise<CommandResponse>

	/**
	 * Publishes an event message to the underlying event transport.
	 *
	 * Event publication is distinct from queue enqueueing and does not imply
	 * durable background job semantics.
	 *
	 * @param message - Event message with `eventName` set.
	 * @param headers - Optional HTTP headers, including propagated tracing headers.
	 */
	sendEvent: (message: EBMessage, headers?: Record<string, string>) => Promise<void>

	/**
	 * Checks whether the sidecar or platform API is available for outgoing traffic.
	 */
	isSidecarAvailable: () => Promise<boolean>
}
