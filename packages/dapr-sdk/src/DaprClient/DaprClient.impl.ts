import { join } from 'node:path'

import type { HttpEventBridgeClient } from '@purista/base-http-bridge'
import type {
	Command,
	CommandResponse,
	EBMessage,
	EBMessageAddress,
	EventBridgeConfig,
	HttpExposedServiceMeta,
} from '@purista/core'
import { convertToKebabCase, HttpClient, StatusCode, UnhandledError } from '@purista/core'

import type { DaprEventBridgeConfig } from '../DaprEventBridge/types/DaprEventBridgeConfig.js'
import { DAPR_API_VERSION } from '../types/constants.js'

/**
 * HTTP client for Dapr sidecar APIs used by the Dapr event bridge.
 *
 * It implements PURISTA's HTTP bridge client contract by mapping command
 * invocation to Dapr service invocation, event emission to Dapr Pub/Sub, and
 * health checks to the sidecar metadata endpoint.
 */
export class DaprClient extends HttpClient<EventBridgeConfig<DaprEventBridgeConfig>> implements HttpEventBridgeClient {
	/**
	 * Returns the internal route Dapr calls for a PURISTA subscription.
	 */
	getInternalPathForSubscription(address: EBMessageAddress) {
		// [baseUrl]/v1.0/invoke/app-user-v1/method/purista/subscription/[subscription-name]
		return join(this.config.pathPrefix ?? 'purista', 'subscription', convertToKebabCase(address.serviceTarget))
	}

	/**
	 * Returns the internal route Dapr calls for a PURISTA command.
	 */
	getInternalPathForCommand(address: EBMessageAddress) {
		// [baseUrl]/v1.0/invoke/user-v1/method/purista/command/[command-name]
		return join(this.config.pathPrefix ?? 'purista', 'command', convertToKebabCase(address.serviceTarget))
	}

	/**
	 * Returns the public REST projection path for an HTTP-exposed command.
	 */
	getApiPathForCommand(addess: EBMessageAddress, metadata: HttpExposedServiceMeta) {
		// [baseUrl]/api/v1/[command expose.http.path]
		return join(this.config.apiPrefix ?? 'api', `v${addess.serviceVersion}`, metadata.expose.http.path)
	}

	/**
	 * Invokes a remote PURISTA command through Dapr service invocation.
	 *
	 * @param command - Full PURISTA command envelope.
	 * @param headers - Optional HTTP headers, including tracing headers.
	 * @param timeout - Optional HTTP request timeout.
	 */
	async invoke(command: Command, headers?: Record<string, string>, timeout?: number): Promise<CommandResponse> {
		// [baseUrl]/v1.0/invoke/user-v1/method/purista/command/[commandName]
		const path = join(
			this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
			'invoke',
			`${this.config.clientConfig?.appPrefix ?? ''}${convertToKebabCase(
				command.receiver.serviceName,
			)}-v${convertToKebabCase(command.receiver.serviceVersion)}`,
			'method',
			this.getInternalPathForCommand(command.receiver),
		)

		return this.post(path, command, { headers, timeout })
	}

	/**
	 * Publishes a PURISTA event message to the configured Dapr Pub/Sub component.
	 *
	 * @throws `UnhandledError` when `message.eventName` is missing.
	 */
	async sendEvent(message: EBMessage, headers?: Record<string, string>) {
		if (!message.eventName) {
			throw new UnhandledError(StatusCode.InternalServerError, 'message can not be sent as event - event name not set')
		}

		const path = join(
			this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION,
			'publish',
			this.config.clientConfig?.pubSubName ?? 'pubsub',
			message.eventName,
		)

		await this.post(path, message, { headers })
	}

	/**
	 * Checks whether the local Dapr sidecar metadata endpoint is reachable.
	 */
	async isSidecarAvailable() {
		try {
			const path = join(this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION, 'metadata')
			const result = await this.get(path)
			return !!result
		} catch {
			return false
		}
	}
}
