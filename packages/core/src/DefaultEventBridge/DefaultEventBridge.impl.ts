import { Stream } from 'node:stream'

import { SpanKind, SpanStatusCode } from '@opentelemetry/api'

import type {
	Command,
	CommandDefinitionMetadataBase,
	CommandErrorResponse,
	CommandSuccessResponse,
	CustomMessage,
	EBMessage,
	EBMessageAddress,
	EBMessageId,
	EventBridge,
	EventBridgeConfig,
	Subscription,
} from '../core/index.js'
import {
	EBMessageType,
	EventBridgeBaseClass,
	EventBridgeEventNames,
	HandledError,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	UnhandledError,
	createErrorResponse,
	createInfoMessage,
	deserializeOtp,
	getCleanedMessage,
	getCommandQueueName,
	getNewCorrelationId,
	getNewEBMessageId,
	getSubscriptionQueueName,
	isCommand,
	isCommandErrorResponse,
	isCommandResponse,
	isCommandSuccessResponse,
	isInfoMessage,
	serializeOtp,
} from '../core/index.js'
import { puristaVersion } from '../version.js'
import { getDefaultEventBridgeConfig } from './getDefaultEventBridgeConfig.impl.js'
import { getNewSubscriptionStorageEntry } from './getNewSubscriptionStorageEntry.impl.js'
import { isMessageMatchingSubscription } from './isMessageMatchingSubscription.impl.js'
import type { DefaultEventBridgeConfig, PendigInvocation, SubscriptionStorageEntry } from './types/index.js'
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

	protected pendingInvocations = new Map<EBMessageId, PendigInvocation>()
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
		return this.hasStarted
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
						for (const [_, subscription] of this.subscriptions) {
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
							mapEntry(message as Readonly<Command>).then(result => {
								this.emitMessage(result)
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

	async unregisterCommand(address: EBMessageAddress): Promise<void> {
		const queueName = getCommandQueueName(address)
		this.serviceFunctions.delete(queueName)
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
		this.subscriptions.delete(queueName)
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
				correlationId: getNewCorrelationId(),
				timestamp: Date.now(),
				messageType: EBMessageType.Command,
				traceId: input.traceId,
			})

			const removeFromPending = () => {
				this.pendingInvocations.delete(correlationId)
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

				this.pendingInvocations.set(command.correlationId, {
					resolve: resolveFn,
					reject: rejectFn,
				})
			})

			this.emitMessage(command)
			return executionPromise
		})
	}

	async destroy(): Promise<void> {
		await super.destroy()

		let isTimedOut = false
		const timeout = setTimeout(() => {
			isTimedOut = true
		}, this.defaultCommandTimeout)

		// ensure actual running commands and subscriptions are finished before closing connection
		const waitForExecutionEnd = () => {
			if (this.pendingInvocations.size <= 0 && this.runningSubscriptionCount <= 0) {
				return
			}
			if (isTimedOut) {
				this.logger.error('Some commands or subscriptions could not finish before connection was closed')
				return
			}
			setImmediate(waitForExecutionEnd)
		}

		waitForExecutionEnd()
		if (timeout) {
			clearTimeout(timeout)
		}

		this.emit(EventBridgeEventNames.EventbridgeDisconnected)

		for (const [_, value] of this.pendingInvocations) {
			value.reject(new UnhandledError(StatusCode.ServiceUnavailable))
		}
		this.pendingInvocations.clear()
		this.removeAllListeners()
		this.writeStream.end().removeAllListeners()
		this.readStream.destroy()
		this.hasStarted = false
		this.healthy = false
	}
}
