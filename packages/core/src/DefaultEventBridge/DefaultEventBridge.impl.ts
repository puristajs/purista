import { Stream } from 'node:stream'

import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import { EventBridgeBaseClass } from '../core/EventBridge/EventBridgeBaseClass.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { EventBridgeConfig } from '../core/EventBridge/types/EventBridgeConfig.js'
import { EventBridgeEventNames } from '../core/EventBridge/types/EventBridgeEvents.js'
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
import { isCommandErrorResponse } from '../core/types/commandType/isCommandErrorResponse.impl.js'
import { isCommandResponse } from '../core/types/commandType/isCommandResponse.impl.js'
import { isCommandSuccessResponse } from '../core/types/commandType/isCommandSuccessResponse.impl.js'
import type { EBMessage } from '../core/types/EBMessage.js'
import type { EBMessageAddress } from '../core/types/EBMessageAddress.js'
import type { EBMessageId } from '../core/types/EBMessageId.js'
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
import type { StreamFrame } from '../core/types/stream/StreamFrame.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { StreamMessage } from '../core/types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import type { Subscription } from '../core/types/subscription/Subscription.js'

import { puristaVersion } from '../version.js'
import { getDefaultEventBridgeConfig } from './getDefaultEventBridgeConfig.impl.js'
import { getNewSubscriptionStorageEntry } from './getNewSubscriptionStorageEntry.impl.js'
import { isMessageMatchingSubscription } from './isMessageMatchingSubscription.impl.js'
import type { DefaultEventBridgeConfig } from './types/DefaultEventBridgeConfig.js'
import type { PendigInvocation } from './types/PendingInvocations.js'
import type { SubscriptionStorageEntry } from './types/SubscriptionStorageEntry.js'

type PendingStreamInvocation<Chunk = unknown, Final = unknown> = {
	push: (frame: StreamFrame<Chunk, Final>) => void
	reject: (error: unknown) => void
	setOwnerInstanceId: (instanceId: string) => Promise<void>
}

/**
 * Simple implementation of some simple in-memory event bridge.
 * Does not support threads and does not need any external databases.
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

	protected pendingInvocations = new Map<EBMessageId, PendigInvocation>()
	protected pendingStreams = new Map<string, PendingStreamInvocation<any, any>>()
	protected runningSubscriptionCount = 0

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
								this.runningSubscriptionCount++
								subscription
									.cb(message)
									.then(result => {
										if (subscription.emitEventName && result) {
											this.emitMessage(result)
										}
									})
									.catch(err => this.logger.error({ err }))
									.finally(() => this.runningSubscriptionCount--)
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
								this.emit(EventBridgeEventNames.EventbridgeError, err)

								const errorResponse = createErrorResponse(this.instanceId, message, StatusCode.BadGateway, err)
								this.emitMessage(errorResponse)
								return next()
							}

							isAtLeastDeliveredOnce = true
							mapEntry(message as Readonly<Command>)
								.then(result => {
									this.emitMessage(result)
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
									this.emit(EventBridgeEventNames.EventbridgeError, err)

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
							const mapEntry = this.pendingInvocations.get(message.correlationId)
							if (!mapEntry) {
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
								this.emit(EventBridgeEventNames.EventbridgeError, err)
								return next()
							}

							isAtLeastDeliveredOnce = true
							if (isCommandSuccessResponse(message)) {
								mapEntry.resolve(message.payload)
							} else if (isCommandErrorResponse(message)) {
								const error = message.isHandledError
									? HandledError.fromMessage(message)
									: UnhandledError.fromMessage(message)
								mapEntry.reject(error)
							}
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
									await pendingStream.setOwnerInstanceId(message.sender.instanceId)
								}
								pendingStream.push(message)
								this.emit(EventBridgeEventNames.StreamFrameReceived, message)
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
							this.emit(EventBridgeEventNames.EventbridgeError, err)
						}

						return next()
					} catch (error) {
						const err = new UnhandledError(StatusCode.InternalServerError, 'eventbus failure', error)
						this.emit(EventBridgeEventNames.EventbridgeError, err)
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

		this.emit(EventBridgeEventNames.EventbridgeConnected)

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

				if (this.config.emitMessagesAsEventBridgeEvents && msg.eventName) {
					this.emit(`custom-${msg.eventName}`, msg)
				}

				if (isStreamMessage(msg as unknown as EBMessage) && isStreamFrame(msg as unknown as StreamMessage)) {
					this.emit(EventBridgeEventNames.StreamFrameSent, msg as unknown as StreamFrame)
				}

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

			const removeFromPending = () => {
				if (!this.pendingInvocations.delete(correlationId)) {
					this.logger.error({ correlationId }, 'Failed to remove from pending invocations')
				}
			}

			const executionPromise = new Promise<T>((resolve, reject) => {
				const timeout = setTimeout(() => {
					const err = new UnhandledError(StatusCode.GatewayTimeout, 'invocation timed out', undefined, command.traceId)
					this.logger.warn({ err })
					rejectFn(err)
				}, commandTimeout)

				const resolveFn = (successPayload: T) => {
					clearTimeout(timeout)
					removeFromPending()
					resolve(successPayload)
				}

				const rejectFn = (err: unknown) => {
					clearTimeout(timeout)
					removeFromPending()
					reject(err)
				}

				this.pendingInvocations.set(correlationId, {
					resolve: resolveFn,
					reject: rejectFn,
				})
			})

			try {
				await this.emitMessage(command)
			} catch (err) {
				const pending = this.pendingInvocations.get(correlationId)
				if (pending) {
					const invocationError =
						err instanceof Error
							? UnhandledError.fromError(err, undefined, undefined, command.traceId)
							: new UnhandledError(StatusCode.InternalServerError, 'invocation emit failed', err, command.traceId)
					pending.reject(invocationError)
				}
			}
			return executionPromise
		})
	}

	async openStream<Chunk = unknown, Final = unknown>(
		input: Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		commandTimeout = this.defaultCommandTimeout,
	): Promise<StreamHandle<Chunk, Final>> {
		const correlationId = getNewCorrelationId()

		let ownerInstanceId: string | undefined
		let pendingCancelReason: string | undefined
		let isDone = false
		let streamError: unknown

		const queue: StreamFrame<Chunk, Final>[] = []
		const waiters: Array<(value: IteratorResult<StreamFrame<Chunk, Final>>) => void> = []

		const flushDone = () => {
			while (waiters.length > 0) {
				const resolve = waiters.shift()
				if (resolve) {
					resolve({ done: true, value: undefined })
				}
			}
		}

		const sendCancel = async (reason?: string) => {
			if (!ownerInstanceId || isDone) {
				pendingCancelReason = reason
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
					instanceId: ownerInstanceId,
				},
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				traceId: input.traceId,
				principalId: input.principalId,
				tenantId: input.tenantId,
				correlationId,
				payload: {
					frameType: 'cancel',
					reason,
				},
			}
			await this.emitMessage(cancelMessage as unknown as Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>)
		}

		const clear = () => {
			if (!this.pendingStreams.delete(correlationId)) {
				this.logger.debug({ correlationId }, 'stream session already cleaned up')
			}
		}

		const timeout = setTimeout(() => {
			if (isDone) {
				return
			}
			streamError = new UnhandledError(
				StatusCode.GatewayTimeout,
				'stream invocation timed out',
				undefined,
				input.traceId,
			)
			isDone = true
			clear()
			flushDone()
		}, commandTimeout)

		this.pendingStreams.set(correlationId, {
			push: (frame: StreamFrame<any, any>) => {
				if (isDone) {
					return
				}
				queue.push(frame)
				const waiter = waiters.shift()
				if (waiter) {
					const nextFrame = queue.shift()
					if (nextFrame) {
						waiter({ done: false, value: nextFrame })
					}
				}

				if (
					frame.payload.frameType === 'complete' ||
					frame.payload.frameType === 'error' ||
					frame.payload.frameType === 'cancel'
				) {
					isDone = true
					clearTimeout(timeout)
					clear()
					if (queue.length === 0) {
						flushDone()
					}
				}
			},
			reject: error => {
				if (isDone) {
					return
				}
				streamError = error
				isDone = true
				clearTimeout(timeout)
				clear()
				flushDone()
			},
			setOwnerInstanceId: async instanceId => {
				ownerInstanceId = instanceId
				if (pendingCancelReason) {
					const reason = pendingCancelReason
					pendingCancelReason = undefined
					await sendCancel(reason)
				}
			},
		})

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
		this.emit(EventBridgeEventNames.StreamOpened, { sessionId: correlationId })

		return {
			sessionId: correlationId,
			cancel: async reason => {
				await sendCancel(reason)
			},
			[Symbol.asyncIterator]: () => {
				return {
					next: async () => {
						if (queue.length > 0) {
							const value = queue.shift()
							if (value) {
								if (
									value.payload.frameType === 'complete' ||
									value.payload.frameType === 'error' ||
									value.payload.frameType === 'cancel'
								) {
									this.emit(EventBridgeEventNames.StreamClosed, { sessionId: correlationId })
								}
								if (isDone && queue.length === 0) {
									flushDone()
								}
								return { done: false, value }
							}
						}

						if (streamError) {
							throw streamError
						}

						if (isDone) {
							this.emit(EventBridgeEventNames.StreamClosed, { sessionId: correlationId })
							return { done: true, value: undefined }
						}

						return await new Promise<IteratorResult<StreamFrame<Chunk, Final>>>(resolve => {
							waiters.push(resolve)
						})
					},
				}
			},
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
				if (this.pendingInvocations.size <= 0 && this.runningSubscriptionCount <= 0) {
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

		this.emit(EventBridgeEventNames.EventbridgeDisconnected)

		for (const [_, value] of Array.from(this.pendingInvocations)) {
			value.reject(new UnhandledError(StatusCode.ServiceUnavailable))
		}
		this.pendingInvocations.clear()

		for (const [_, value] of Array.from(this.pendingStreams)) {
			value.reject(new UnhandledError(StatusCode.ServiceUnavailable, 'stream closed'))
		}
		this.pendingStreams.clear()

		this.removeAllListeners()
		this.writeStream.end().removeAllListeners()
		this.readStream.destroy()
		this.hasStarted = false
		this.healthy = false
	}
}
