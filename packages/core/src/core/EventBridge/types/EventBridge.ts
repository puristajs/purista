import type { CustomMessage } from '../../types/CustomMessage.js'
import type { Command } from '../../types/commandType/Command.js'
import type { CommandDefinitionMetadataBase } from '../../types/commandType/CommandDefinitionMetadataBase.js'
import type { CommandErrorResponse } from '../../types/commandType/CommandErrorResponse.js'
import type { CommandSuccessResponse } from '../../types/commandType/CommandSuccessResponse.js'
import type { DefinitionEventBridgeConfig } from '../../types/DefinitionEventBridgeConfig.js'
import type { EBMessage } from '../../types/EBMessage.js'
import type { EBMessageAddress } from '../../types/EBMessageAddress.js'
import type { Subscription } from '../../types/subscription/Subscription.js'

/**
 * Event bridge interface
 * The event bridge must implement this interface.
 *
 * @group Event bridge
 */
export interface EventBridge {
	readonly name: string

	readonly instanceId: string
	/**
	 * The default time until when a command invocation automatically returns a time out error
	 */
	readonly defaultCommandTimeout: number

	/**
	 * Start the eventbridge and connect to the underlaying message broker
	 */
	start(): Promise<void>

	/**
	 * Emit a message to the eventbridge without awaiting a result
	 * @param message the message
	 */
	emitMessage(message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>): Promise<Readonly<EBMessage>>

	/**
	 * Call a command of a service and return the result of this command
	 * @param input a partial command message
	 * @param contentType the content type of the message payload
	 * @param contentEncoding the content encoding of the message
	 * @param ttl the time to live (timeout) of the invocation
	 */
	invoke<T>(input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>, ttl?: number): Promise<T>

	/**
	 *
	 * @param address the address of the service command (service name, version and command name)
	 * @param cb the function to be called if a matching command arrives
	 */
	registerCommand(
		address: EBMessageAddress,
		cb: (
			message: Command,
		) => Promise<
			Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
		>,
		metadata: CommandDefinitionMetadataBase,
		eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string>

	/**
	 * Unregister a service command
	 * @param address The address (service name, version and command name) of the command to be de-registered
	 */
	unregisterCommand(address: EBMessageAddress): Promise<void>

	/**
	 * Register a new subscription
	 * @param subscription the subscription definition
	 * @param cb the function to be called if a matching message arrives
	 */
	registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string>

	/**
	 *
	 * @param address
	 */
	unregisterSubscription(address: EBMessageAddress): Promise<void>

	/**
	 * Indicates if the eventbridge has been started and is connected to underlaying message broker
	 */
	isReady(): Promise<boolean>

	/**
	 * Indicates if the eventbridge is running and works correctly
	 */
	isHealthy(): Promise<boolean>

	/**
	 * Shut down event bridge as gracefully as possible
	 */
	destroy(): Promise<void>
}
