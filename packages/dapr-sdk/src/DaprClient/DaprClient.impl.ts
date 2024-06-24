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
import { HttpClient, StatusCode, UnhandledError, convertToKebabCase } from '@purista/core'

import type { DaprEventBridgeConfig } from '../DaprEventBridge/index.js'
import { DAPR_API_VERSION } from '../types/index.js'

export class DaprClient extends HttpClient<EventBridgeConfig<DaprEventBridgeConfig>> implements HttpEventBridgeClient {
	getInternalPathForSubscription(address: EBMessageAddress) {
		// [baseUrl]/v1.0/invoke/app-user-v1/method/purista/subscription/[subscription-name]
		return join(this.config.pathPrefix ?? 'purista', 'subscription', convertToKebabCase(address.serviceTarget))
	}

	getInternalPathForCommand(address: EBMessageAddress) {
		// [baseUrl]/v1.0/invoke/user-v1/method/purista/command/[command-name]
		return join(this.config.pathPrefix ?? 'purista', 'command', convertToKebabCase(address.serviceTarget))
	}

	getApiPathForCommand(addess: EBMessageAddress, metadata: HttpExposedServiceMeta) {
		// [baseUrl]/api/v1/[command expose.http.path]
		return join(this.config.apiPrefix ?? 'api', `v${addess.serviceVersion}`, metadata.expose.http.path)
	}

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

	async isSidecarAvailable() {
		try {
			const path = join(this.config.clientConfig?.daprApiVersion ?? DAPR_API_VERSION, 'metadata')
			const result = await this.get(path)
			return !!result
		} catch (e) {
			return false
		}
	}
}
