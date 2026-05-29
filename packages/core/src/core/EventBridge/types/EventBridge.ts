import type { CustomMessage } from '../../types/CustomMessage.js'
import type { Command } from '../../types/commandType/Command.js'
import type { CommandDefinitionMetadataBase } from '../../types/commandType/CommandDefinitionMetadataBase.js'
import type { CommandErrorResponse } from '../../types/commandType/CommandErrorResponse.js'
import type { CommandSuccessResponse } from '../../types/commandType/CommandSuccessResponse.js'
import type { DefinitionEventBridgeConfig } from '../../types/DefinitionEventBridgeConfig.js'
import type { EBMessage } from '../../types/EBMessage.js'
import type { EBMessageAddress } from '../../types/EBMessageAddress.js'
import type {
	InFlightExecutionCounts,
	PausedSubscriptionConsumersByRegistrationKey,
} from '../../types/ServiceOperatorState.js'
import type { StreamDefinitionMetadataBase } from '../../types/stream/StreamDefinitionMetadataBase.js'
import type { StreamHandle } from '../../types/stream/StreamHandle.js'
import type { StreamMessage } from '../../types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../../types/stream/StreamOpenRequest.js'
import type { Subscription } from '../../types/subscription/Subscription.js'
import type { EventBridgeCapabilities } from './EventBridgeCapabilities.js'

/**
 * Event transport adapter contract used by PURISTA services.
 *
 * Event bridges route commands, command responses, events, subscriptions, and
 * streams. Adapters must expose their real reliability behavior through
 * {@link EventBridge.capabilities}; service definitions use those flags for
 * strict capability validation at startup.
 *
 * @group Event bridge
 */
export interface EventBridge {
	/** Human-readable bridge name used in logs, traces, and metrics. */
	readonly name: string
	/** Runtime capability matrix used for strict startup validation. */
	readonly capabilities: EventBridgeCapabilities

	/** Stable runtime instance id used to distinguish bridge processes. */
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
	 * Emit a message to the event bridge without awaiting a result.
	 *
	 * The bridge adds transport metadata such as message id, timestamp, and
	 * correlation id. Payloads should already be minimized and schema-validated
	 * by the caller or service runtime.
	 *
	 * @param message the message
	 */
	emitMessage(message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>): Promise<Readonly<EBMessage>>

	/**
	 * Call a command of a service and return the result of this command
	 *
	 * Late responses after timeout are handled according to bridge capability,
	 * commonly ignored with a warning to avoid resolving stale callers.
	 *
	 * @param input a partial command message
	 * @param ttl the time to live (timeout) of the invocation
	 */
	invoke<T>(input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>, ttl?: number): Promise<T>

	/**
	 * Open a stream invocation.
	 *
	 * The returned handle can be consumed via async iteration and can be
	 * cancelled by caller. Late frames after timeout are handled according to
	 * bridge capability.
	 */
	openStream<Chunk = unknown, Final = unknown>(
		input: Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		ttl?: number,
	): Promise<StreamHandle<Chunk, Final>>

	/**
	 * Register a command handler for a service target.
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
	 * Register a service stream handler for a service target.
	 */
	registerStream(
		address: EBMessageAddress,
		cb: (message: StreamMessage) => Promise<void>,
		metadata: StreamDefinitionMetadataBase,
		eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string>

	/**
	 * Unregister a service command
	 * @param address The address (service name, version and command name) of the command to be de-registered
	 */
	unregisterCommand(address: EBMessageAddress): Promise<void>

	/**
	 * Unregister a service stream
	 */
	unregisterStream(address: EBMessageAddress): Promise<void>

	/**
	 * Register a new subscription.
	 *
	 * Subscription failure semantics depend on the bridge capabilities and the
	 * subscription definition. Strict failure handling should fail startup when
	 * the bridge cannot honor it.
	 *
	 * @param subscription the subscription definition
	 * @param cb the function to be called if a matching message arrives
	 */
	registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string>

	/**
	 * Unregister a subscription.
	 *
	 * @param address subscription address to remove
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

	/**
	 * Number of currently running handlers across all work kinds.
	 */
	getInFlightExecutionCount(): number

	/**
	 * Number of currently running handlers grouped by work kind.
	 */
	getInFlightExecutionCounts(): InFlightExecutionCounts

	/**
	 * Returns paused subscription consumer states keyed by adapter registration key.
	 */
	getPausedSubscriptionConsumers(): PausedSubscriptionConsumersByRegistrationKey

	/**
	 * Resumes a paused subscription consumer by registration key.
	 */
	resumeSubscriptionConsumer(registrationKey: string): Promise<void>
}
