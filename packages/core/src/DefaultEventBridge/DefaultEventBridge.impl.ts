import { Stream } from 'node:stream'

import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import { EventBridgeBaseClass } from '../core/EventBridge/EventBridgeBaseClass.impl.js'
import { PendingInvocationRegistry } from '../core/EventBridge/PendingInvocationRegistry.impl.js'
import { PendingStreamRegistry } from '../core/EventBridge/PendingStreamRegistry.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import {
	EventBridgeCommandTransport,
	EventBridgeResponseConfirmationLevel,
} from '../core/EventBridge/types/EventBridgeCommandCapabilities.js'
import type { EventBridgeConfig } from '../core/EventBridge/types/EventBridgeConfig.js'
import { EventBridgeLateResponseHandling } from '../core/EventBridge/types/EventBridgeLateResponseHandling.js'
import { EventBridgeStreamLateFrameHandling } from '../core/EventBridge/types/EventBridgeStreamLateFrameHandling.js'
import { createErrorResponse } from '../core/helper/createErrorResponse.impl.js'
import { createInfoMessage } from '../core/helper/createInfoMessage.impl.js'
import { getCleanedMessage } from '../core/helper/getCleanedMessage.impl.js'
import { getCommandQueueName } from '../core/helper/getCommandQueueName.impl.js'
import { getNewCorrelationId } from '../core/helper/getNewCorrelationId.impl.js'
import { getNewEBMessageId } from '../core/helper/getNewEBMessageId.impl.js'
import { getSubscriptionQueueName } from '../core/helper/getSubscriptionQueueName.impl.js'
import { deserializeOtp, serializeOtp } from '../core/helper/serializeOtp.impl.js'
import type { CustomMessage } from '../core/types/CustomMessage.js'
import type { Command } from '../core/types/commandType/Command.js'
import type { CommandDefinitionMetadataBase } from '../core/types/commandType/CommandDefinitionMetadataBase.js'
import type { CommandErrorResponse } from '../core/types/commandType/CommandErrorResponse.js'
import type { CommandSuccessResponse } from '../core/types/commandType/CommandSuccessResponse.js'
import { isCommand } from '../core/types/commandType/isCommand.impl.js'
import { isCommandResponse } from '../core/types/commandType/isCommandResponse.impl.js'
import { isCommandSuccessResponse } from '../core/types/commandType/isCommandSuccessResponse.impl.js'
import type { EBMessage } from '../core/types/EBMessage.js'
import type { EBMessageAddress } from '../core/types/EBMessageAddress.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import { isInfoMessage } from '../core/types/infoType/isInfoMessage.impl.js'
import { PuristaSpanName } from '../core/types/PuristaSpanName.enum.js'
import { PuristaSpanTag } from '../core/types/PuristaSpanTag.enum.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { isStreamControl } from '../core/types/stream/isStreamControl.impl.js'
import { isStreamFrame } from '../core/types/stream/isStreamFrame.impl.js'
import { isStreamMessage } from '../core/types/stream/isStreamMessage.impl.js'
import { isStreamOpenRequest } from '../core/types/stream/isStreamOpenRequest.impl.js'
import type { StreamDefinitionMetadataBase } from '../core/types/stream/StreamDefinitionMetadataBase.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { StreamMessage } from '../core/types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import type { Subscription } from '../core/types/subscription/Subscription.js'

import { puristaVersion } from '../version.js'
import { getDefaultEventBridgeConfig } from './getDefaultEventBridgeConfig.impl.js'
import { getNewSubscriptionStorageEntry } from './getNewSubscriptionStorageEntry.impl.js'
import { isMessageMatchingSubscription } from './isMessageMatchingSubscription.impl.js'
import type { DefaultEventBridgeConfig } from './types/DefaultEventBridgeConfig.js'
import type { SubscriptionStorageEntry } from './types/SubscriptionStorageEntry.js'

/**
 * Process-local in-memory event bridge for development and tests.
 *
 * The bridge supports command invocation, subscriptions, and streams in one
 * Node.js process. It is not durable: messages, pending invocations, and
 * subscriptions are lost on process shutdown. Late command responses and late
 * stream frames are ignored with warnings to avoid resolving timed-out callers.
 *
 * @example
 * ```typescript
 * import { DefaultEventBridge } from '@purista/core'
 *
 * const eventBridge = new DefaultEventBridge()
 * await eventBridge.start()
 *
 * // add your services
 * ```
 *
 * @group Event bridge
 */
export class DefaultEventBridge extends EventBridgeBaseClass<DefaultEventBridgeConfig> implements EventBridge {
	protected writeStream = new Stream.Writable({ objectMode: true })
	protected readStream = new Stream.Readable({
		objectMode: true,
		read() {
			/* nothing to do here */
		},
	})

	protected serviceFunctions = new Map<
		string,
		(message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>
	>()

	protected streamFunctions = new Map<string, (message: StreamMessage) => Promise<void>>()
	/** @internal Runtime registry; adapter implementations must not depend on it. */
	protected pendingInvocations = new PendingInvocationRegistry<unknown>({
		onLateResponse: correlationId => {
			this.logger.warn({ correlationId }, 'Ignoring late command response after invocation timeout')
		},
	})
	/** @internal Runtime registry; adapter implementations must not depend on it. */
	protected pendingStreams = new PendingStreamRegistry<any, any>({
		onLateFrame: correlationId => {
			this.logger.warn({ correlationId }, 'Ignoring late stream frame after stream timeout')
		},
	})

	/** @internal Runtime registry; adapter implementations must not depend on it. */
	protected subscriptions = new Map<string, SubscriptionStorageEntry>()

	protected hasStarted = false
	protected healthy = false

	constructor(config?: EventBridgeConfig<DefaultEventBridgeConfig>) {
		const conf = {
			...getDefaultEventBridgeConfig(),
			logWarnOnMessagesWithoutReceiver: true,
			...config,
		}
		super('DefaultEventBridge', conf)
		this.capabilities = {
			supportsStreams: true,
			durableCommands: false,
			durableSubscriptions: false,
			manualAckSupported: false,
			lateResponseHandling: EventBridgeLateResponseHandling.IgnoreWithWarning,
			gracefulDrainSupported: true,
			nativeDeadLettering: false,
			commandHandling: {
				transport: EventBridgeCommandTransport.InMemory,
				pendingInvocationCancellation: true,
				responseConfirmation: EventBridgeResponseConfirmationLevel.None,
				strictMode: true,
			},
			streamHandling: {
				incrementalDelivery: true,
				consumerCancellation: true,
				gracefulStreamDrain: true,
				aggregatedFinalSupported: true,
				lateFrameHandling: EventBridgeStreamLateFrameHandling.IgnoreWithWarning,
			},
			consumerFailureHandling: {
				boundedRetry: false,
				delayedRetry: false,
				deadLetterTarget: false,
				drop: false,
				stopConsumer: false,
				consumerPauseResume: false,
				bridgeManagedDeadLettering: false,
				nativeDeadLettering: false,
				fatalClassification: false,
				strictMode: true,
			},
		}
	}

	async isReady() {
		return this.hasStarted
	}

	async isHealthy() {
		return this.healthy
	}

	async start() {
		await super.start()
		const write = async (message: Readonly<EBMessage>, _encoding: string, next: (error?: Error) => void) => {
			const context = deserializeOtp(this.logger, message.otp)

			return this.startActiveSpan(
				PuristaSpanName.EventBridgeHandleIncomingMessage,
				{ kind: SpanKind.CONSUMER },
				context,
				async span => {
					try {
						let isAtLeastDeliveredOnce = false
						for (const [_, subscription] of Array.from(this.subscriptions)) {
							if (isMessageMatchingSubscription(this.logger, message, subscription)) {
								isAtLeastDeliveredOnce = true
								this.runInFlight(() => subscription.cb(message), 'subscription')
									.then(result => {
										if (subscription.emitEventName && result) {
											return this.emitMessage(result)
										}
									})
									.catch(err => this.logger.error({ err }))
							}
						}

						if (isCommand(message)) {
							const mapEntry = this.serviceFunctions.get(getCommandQueueName(message.receiver))
							if (!mapEntry) {
								const err = new UnhandledError(
									StatusCode.BadGateway,
									'InvalidCommand: received invalid command',
									getCleanedMessage(message),
								)
								span.setStatus({
									code: SpanStatusCode.ERROR,
									message: err.message,
								})
								span.recordException(err)
								this.logger.error({ err, ...span.spanContext(), customTraceId: message.traceId }, err.message)

								const errorResponse = createErrorResponse(this.instanceId, message, StatusCode.BadGateway, err)
								this.emitMessage(errorResponse)
								return next()
							}

							isAtLeastDeliveredOnce = true
							this.runInFlight(() => mapEntry(message as Readonly<Command>), 'command')
								.then(result => {
									return this.emitMessage(result)
								})
								.catch(error => {
									const err = UnhandledError.fromError(
										error,
										StatusCode.InternalServerError,
										getCleanedMessage(message),
									)
									span.setStatus({
										code: SpanStatusCode.ERROR,
										message: err.message,
									})
									span.recordException(err)
									this.logger.error({ err, ...span.spanContext(), customTraceId: message.traceId }, err.message)

									const errorResponse = createErrorResponse(
										this.instanceId,
										message,
										StatusCode.InternalServerError,
										err,
									)
									this.emitMessage(errorResponse)
								})
							return next()
						}

						if (isCommandResponse(message)) {
							const result = isCommandSuccessResponse(message)
								? this.pendingInvocations.resolve(message.correlationId, message.payload)
								: this.pendingInvocations.reject(
										message.correlationId,
										message.isHandledError ? HandledError.fromMessage(message) : UnhandledError.fromMessage(message),
									)
							if (result !== 'resolved' && result !== 'rejected') {
								if (result === 'late') {
									this.logger.warn(
										{ correlationId: message.correlationId, customTraceId: message.traceId },
										'Ignoring late command response after invocation timeout',
									)
									return next()
								}
								const err = new UnhandledError(
									StatusCode.BadGateway,
									'InvalidCommandResponse: received invalid command response',
									getCleanedMessage(message),
								)
								span.setStatus({
									code: SpanStatusCode.ERROR,
									message: err.message,
								})
								span.recordException(err)
								this.logger.error({ err, ...span.spanContext(), customTraceId: message.traceId }, err.message)
								return next()
							}

							isAtLeastDeliveredOnce = true
							return next()
						}

						if (isStreamMessage(message)) {
							if (isStreamFrame(message)) {
								const pendingStream = this.pendingStreams.get(message.correlationId)
								if (!pendingStream) {
									return next()
								}
								isAtLeastDeliveredOnce = true
								if (message.payload.frameType === 'start') {
									const pendingCancelReason = pendingStream.markOwner(message.sender.instanceId)
									if (pendingCancelReason !== undefined) {
										await this.emitMessage({
											messageType: EBMessageType.Stream,
											sender: {
												serviceName: message.receiver.serviceName,
												serviceVersion: message.receiver.serviceVersion,
												serviceTarget: message.receiver.serviceTarget,
												instanceId: this.instanceId,
											},
											receiver: {
												serviceName: message.sender.serviceName,
												serviceVersion: message.sender.serviceVersion,
												serviceTarget: message.sender.serviceTarget,
												instanceId: message.sender.instanceId,
											},
											contentType: 'application/json',
											contentEncoding: 'utf-8',
											traceId: message.traceId,
											principalId: message.principalId,
											tenantId: message.tenantId,
											payload: {
												frameType: 'cancel',
												reason: pendingCancelReason,
											},
										} as unknown as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
									}
								}
								pendingStream.push(message)
								return next()
							}

							const streamTarget = this.streamFunctions.get(getCommandQueueName(message.receiver))
							if (!streamTarget) {
								return next()
							}

							if (isStreamOpenRequest(message) || isStreamControl(message)) {
								isAtLeastDeliveredOnce = true
								void streamTarget(message)
								return next()
							}
						}

						if (isInfoMessage(message)) {
							this.logger.trace('info message', message)
							return next()
						}

						if (!isAtLeastDeliveredOnce && this.config.logWarnOnMessagesWithoutReceiver) {
							const err = new UnhandledError(
								StatusCode.BadGateway,
								'InvalidMessage: received a message which is not consumed by any service command or subscription',
								message,
							)
							this.logger.warn({ err, ...span.spanContext(), customTraceId: message.traceId }, err.message)
						}

						return next()
					} catch (error) {
						const err = new UnhandledError(StatusCode.InternalServerError, 'eventbus failure', error)
						this.logger.error({ err, ...span.spanContext() }, err.message)

						span.recordException(err)

						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: err.message,
						})

						this.healthy = false

						return next(error as Error)
					}
				},
			)
		}

		this.writeStream._write = write.bind(this)

		this.readStream.pipe(this.writeStream)

		this.logger.info({ puristaVersion }, 'DefaultEventBridge started')

		this.hasStarted = true
		this.healthy = true
	}

	/**
	 * Register a service command and ensure that there is a queue for all incoming command requests.
	 * @param address The service function address
	 * @param cb the function to call if a matching command message arrives
	 * @returns the id of command function queue
	 */
	async registerCommand(
		address: EBMessageAddress,
		cb: (message: Command) => Promise<CommandSuccessResponse<unknown> | CommandErrorResponse>,
		metadata: CommandDefinitionMetadataBase,
	): Promise<string> {
		const queueName = getCommandQueueName(address)
		this.serviceFunctions.set(queueName, cb)

		const info = createInfoMessage(
			EBMessageType.InfoServiceFunctionAdded,
			{ ...address, instanceId: this.instanceId },
			{
				payload: metadata,
			},
		)
		await this.emitMessage(info)

		return queueName
	}

	async registerStream(
		address: EBMessageAddress,
		cb: (message: StreamMessage) => Promise<void>,
		metadata: StreamDefinitionMetadataBase,
	): Promise<string> {
		const queueName = getCommandQueueName(address)
		this.streamFunctions.set(queueName, cb)

		const info = createInfoMessage(
			EBMessageType.InfoServiceFunctionAdded,
			{ ...address, instanceId: this.instanceId },
			{
				payload: metadata,
			},
		)
		await this.emitMessage(info)

		return queueName
	}

	async unregisterCommand(address: EBMessageAddress): Promise<void> {
		const queueName = getCommandQueueName(address)
		if (!this.serviceFunctions.delete(queueName)) {
			this.logger.error({ queueName, address }, 'Failed to clean unregister service command')
		}
	}

	async unregisterStream(address: EBMessageAddress): Promise<void> {
		const queueName = getCommandQueueName(address)
		if (!this.streamFunctions.delete(queueName)) {
			this.logger.error({ queueName, address }, 'Failed to clean unregister service stream')
		}
	}

	async registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string> {
		const queueName = getSubscriptionQueueName(subscription.subscriber)
		const entry = getNewSubscriptionStorageEntry(subscription, cb)
		this.subscriptions.set(queueName, entry)
		return queueName
	}

	async unregisterSubscription(address: EBMessageAddress): Promise<void> {
		const queueName = getSubscriptionQueueName(address)
		if (!this.subscriptions.delete(queueName)) {
			this.logger.error({ queueName, address }, 'Failed to clean unregister service subscription')
		}
	}

	/**
	 * Emit a new message to event bridge to be delivered to receiver
	 *
	 * @param message EBMessage
	 */
	async emitMessage(message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>): Promise<Readonly<EBMessage>> {
		const context = deserializeOtp(this.logger, message.otp)

		const name = isCommandResponse(message as EBMessage)
			? PuristaSpanName.EventBridgeCommandResponse
			: PuristaSpanName.EventBridgeEmitMessage

		return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async span => {
			try {
				const msg = Object.freeze({
					...message,
					id: getNewEBMessageId(),
					timestamp: Date.now(),
					traceId: message.traceId,
					instanceId: this.instanceId,
					otp: serializeOtp(),
				})

				span.setAttribute(PuristaSpanTag.SenderServiceName, msg.sender.serviceName)
				span.setAttribute(PuristaSpanTag.SenderServiceVersion, msg.sender.serviceVersion)
				span.setAttribute(PuristaSpanTag.SenderServiceTarget, msg.sender.serviceTarget)

				this.readStream.push(msg)

				return msg as Readonly<EBMessage>
			} catch (err) {
				span.recordException(err as Error)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: (err as Error).message,
				})
				this.logger.error({ err, ...span.spanContext(), customTraceId: message.traceId }, 'emitMessage failed')
				throw err
			}
		})
	}

	async invoke<T>(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		commandTimeout = this.defaultCommandTimeout,
	): Promise<T> {
		const context = deserializeOtp(this.logger, input.otp)

		return this.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, context, async _span => {
			const correlationId = getNewCorrelationId()

			const command: Command = Object.freeze({
				...input,
				otp: serializeOtp(),
				sender: {
					...input.sender,
					instanceId: this.instanceId,
				},
				id: getNewEBMessageId(),
				correlationId,
				timestamp: Date.now(),
				messageType: EBMessageType.Command,
				traceId: input.traceId,
			})

			const executionPromise = this.pendingInvocations.register(
				correlationId,
				commandTimeout,
				command.traceId,
			) as Promise<T>

			try {
				await this.emitMessage(command)
			} catch (err) {
				const invocationError =
					err instanceof Error
						? UnhandledError.fromError(err, undefined, undefined, command.traceId)
						: new UnhandledError(StatusCode.InternalServerError, 'invocation emit failed', err, command.traceId)
				this.pendingInvocations.reject(correlationId, invocationError)
			}
			return executionPromise
		})
	}

	async openStream<Chunk = unknown, Final = unknown>(
		input: Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		commandTimeout = this.defaultCommandTimeout,
	): Promise<StreamHandle<Chunk, Final>> {
		const correlationId = getNewCorrelationId()
		const session = this.pendingStreams.register(correlationId, commandTimeout, input.traceId)

		const sendCancel = async (reason?: string) => {
			const cancelState = session.requestCancel(reason)
			if (!cancelState.shouldSend || !cancelState.ownerInstanceId) {
				return
			}

			const cancelMessage: Omit<StreamMessage, 'id' | 'timestamp'> = {
				messageType: EBMessageType.Stream,
				sender: {
					...input.sender,
					instanceId: this.instanceId,
				},
				receiver: {
					...input.receiver,
					instanceId: cancelState.ownerInstanceId,
				},
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				traceId: input.traceId,
				principalId: input.principalId,
				tenantId: input.tenantId,
				correlationId,
				payload: {
					frameType: 'cancel',
					reason: cancelState.reason,
				},
			}
			await this.emitMessage(cancelMessage as unknown as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
		}

		const streamOpenMessage: Omit<StreamOpenRequest, 'id' | 'timestamp'> = {
			messageType: EBMessageType.Stream,
			sender: {
				...input.sender,
				instanceId: this.instanceId,
			},
			receiver: input.receiver,
			contentType: input.contentType,
			contentEncoding: input.contentEncoding,
			traceId: input.traceId,
			principalId: input.principalId,
			tenantId: input.tenantId,
			correlationId,
			payload: input.payload,
		}

		await this.emitMessage(streamOpenMessage as unknown as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)

		return {
			sessionId: session.handle.sessionId,
			cancel: async reason => {
				await sendCancel(reason)
			},
			[Symbol.asyncIterator]: () => session.handle[Symbol.asyncIterator](),
		}
	}

	async destroy(): Promise<void> {
		await super.destroy()

		let isTimedOut = false
		const timeout = setTimeout(() => {
			isTimedOut = true
		}, this.defaultCommandTimeout)

		// ensure actual running commands and subscriptions are finished before closing connection
		await new Promise<void>(resolve => {
			const waitForExecutionEnd = () => {
				if (
					this.pendingInvocations.size <= 0 &&
					this.pendingStreams.size <= 0 &&
					this.getInFlightExecutionCount() <= 0
				) {
					resolve()
					return
				}
				if (isTimedOut) {
					this.logger.error('Some commands or subscriptions could not finish before connection was closed')
					resolve()
					return
				}
				setImmediate(waitForExecutionEnd)
			}

			waitForExecutionEnd()
		})

		clearTimeout(timeout)

		this.pendingInvocations.rejectAll(new UnhandledError(StatusCode.ServiceUnavailable))
		this.pendingStreams.rejectAll(new UnhandledError(StatusCode.ServiceUnavailable, 'stream closed'))

		this.writeStream.end().removeAllListeners()
		this.readStream.destroy()
		this.hasStarted = false
		this.healthy = false
	}
}
