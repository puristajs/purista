import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api'
import type {
	Command,
	CommandDefinitionMetadataBase,
	CommandErrorResponse,
	CommandSuccessResponse,
	CustomMessage,
	DefinitionEventBridgeConfig,
	EBMessage,
	EBMessageAddress,
	EventBridge,
	EventBridgeConfig,
	Subscription,
} from '@purista/core'
import {
	createInfoMessage,
	deserializeOtp,
	EBMessageType,
	EventBridgeBaseClass,
	EventBridgeCommandTransport,
	EventBridgeLateResponseHandling,
	EventBridgeResponseConfirmationLevel,
	EventBridgeStreamLateFrameHandling,
	getCleanedMessage,
	getNewCorrelationId,
	getNewEBMessageId,
	HandledError,
	isCommandResponse,
	isCommandSuccessResponse,
	isInfoMessage,
	PendingInvocationRegistry,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	SubscriptionConsumerControlError,
	serializeOtp,
	UnhandledError,
} from '@purista/core'
import type { ChannelModel, ConfirmChannel } from 'amqplib'
import amqplib from 'amqplib'

import { deserializeOtpFromAmqpHeader } from './deserializeOtpFromAmqpHeader.impl.js'
import { getCommandQueueName } from './getCommandQueueName.impl.js'
import { getDefaultConfig } from './getDefaultConfig.impl.js'
import { getSubscriptionQueueName } from './getSubscriptionQueueName.impl.js'
import { jsonEncoder } from './payloadHandling/jsonEncoder.js'
import { plainEncrypter } from './payloadHandling/plainEncrypter.js'

import { serializeOtpForAmqpHeader } from './serializeOtpForAmqpHeader.impl.js'
import type { AmqpBridgeConfig } from './types/AmqpBridgeConfig.js'
import type { Encoder } from './types/Encoder.js'
import type { Encrypter } from './types/Encrypter.js'

const RETRY_ATTEMPT_HEADER = 'x-purista-retry-attempt'
const DEAD_LETTER_REASON_HEADER = 'x-purista-dead-letter-reason'

type PausedSubscriptionState = {
	pausedAt: number
	reason: string
}

type RegisteredSubscription = {
	cb: (message: CustomMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>
	channel: ConfirmChannel
	queueName: string
	subscription: Subscription
	noAck: boolean
	consumeHandler: (msg: amqplib.ConsumeMessage | null) => Promise<unknown>
	consumerTag?: string
}

/**
 * The AMQP event bridge connects to a AMQP broker.
 *
 * @example
 * ```typescript
 * import { AmqpBridge } from '@purista/amqpbridge'
 *
 * // create and init our eventbridge
 * const config = {
 *    url: 'amqp://localhost'
 * }
 *
 * const eventBridge = new AmqpBridge(config)
 * await eventBridge.start()
 *
 * ```
 *
 * @group Event bridge
 */
export class AmqpBridge extends EventBridgeBaseClass<AmqpBridgeConfig> implements EventBridge {
	protected connection?: ChannelModel
	protected channel?: ConfirmChannel

	protected healthy = false
	protected ready = false

	protected consumerRegistrations: { channel: ConfirmChannel; tag: string }[] = []

	protected replyQueueName?: string
	protected serviceFunctions = new Map<
		string,
		{
			cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>
			channel: ConfirmChannel
		}
	>()

	protected pendingInvocations = new PendingInvocationRegistry<unknown>({
		onLateResponse: correlationId => {
			this.logger.warn({ correlationId }, 'Ignoring late command response after invocation timeout')
		},
	})

	protected subscriptions = new Map<string, RegisteredSubscription>()
	protected pausedSubscriptionConsumers = new Map<string, PausedSubscriptionState>()

	protected encoder: Encoder = {
		...jsonEncoder,
	}

	protected encrypter: Encrypter = {
		...plainEncrypter,
	}

	protected addConsumerRegistration(channel: ConfirmChannel, tag: string) {
		this.consumerRegistrations.push({ channel, tag })
	}

	protected removeConsumerRegistrationsForChannel(channel: ConfirmChannel) {
		this.consumerRegistrations = this.consumerRegistrations.filter(entry => entry.channel !== channel)
	}

	protected removeConsumerRegistration(channel: ConfirmChannel, tag: string) {
		this.consumerRegistrations = this.consumerRegistrations.filter(
			entry => !(entry.channel === channel && entry.tag === tag),
		)
	}

	protected async sendToQueueAndConfirm(
		channel: ConfirmChannel,
		queueName: string,
		content: Buffer,
		options: Parameters<ConfirmChannel['sendToQueue']>[2],
	) {
		channel.sendToQueue(queueName, content, options)
		if ('waitForConfirms' in channel && typeof channel.waitForConfirms === 'function') {
			await channel.waitForConfirms()
		}
	}

	protected async createPublishingChannel() {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'No connection - not connected')
		}
		if ('createConfirmChannel' in this.connection && typeof this.connection.createConfirmChannel === 'function') {
			return this.connection.createConfirmChannel()
		}
		return this.connection.createChannel() as Promise<ConfirmChannel>
	}

	protected getConsumerAttempt(headers: unknown) {
		if (!headers || typeof headers !== 'object') {
			return 1
		}

		const attempt = (headers as Record<string, unknown>)[RETRY_ATTEMPT_HEADER]
		if (typeof attempt === 'number' && Number.isFinite(attempt) && attempt >= 1) {
			return attempt
		}
		if (typeof attempt === 'string') {
			const parsed = Number.parseInt(attempt, 10)
			if (Number.isFinite(parsed) && parsed >= 1) {
				return parsed
			}
		}

		return 1
	}

	protected getSubscriptionDeadLetterTarget(subscription: Subscription) {
		return subscription.eventBridgeConfig.consumerFailureHandling?.deadLetterTarget ?? this.config.deadLetterRoutingKey
	}

	protected getSubscriptionFailureReason(error: unknown) {
		if (error instanceof UnhandledError && error.data && typeof error.data === 'object' && 'error' in error.data) {
			const cause = (error.data as { error?: unknown }).error
			if (cause instanceof Error) {
				return cause.message
			}
			if (typeof cause === 'string') {
				return cause
			}
		}

		if (error instanceof Error) {
			return error.message
		}

		return String(error)
	}

	protected async retrySubscriptionMessage(
		channel: ConfirmChannel,
		queueName: string,
		msg: amqplib.ConsumeMessage,
		nextAttempt: number,
		retryDelayMs: number,
		durable: boolean,
	) {
		const retryQueueName =
			retryDelayMs > 0 && durable ? this.getSubscriptionRetryQueueName(queueName, retryDelayMs) : queueName
		if (retryQueueName !== queueName) {
			await this.ensureSubscriptionRetryQueue(channel, queueName, retryQueueName, retryDelayMs)
		}

		const headers = {
			...(msg.properties.headers ?? {}),
			[RETRY_ATTEMPT_HEADER]: nextAttempt,
		}
		await this.sendToQueueAndConfirm(channel, retryQueueName, msg.content, {
			headers,
			contentType: msg.properties.contentType,
			contentEncoding: msg.properties.contentEncoding,
			correlationId: msg.properties.correlationId,
			replyTo: msg.properties.replyTo,
			messageId: msg.properties.messageId,
			timestamp: msg.properties.timestamp,
			type: msg.properties.type,
			appId: msg.properties.appId,
		})
		channel.ack(msg)
	}

	protected getSubscriptionRetryQueueName(queueName: string, retryDelayMs: number) {
		return `${queueName}.retry.${retryDelayMs}`
	}

	protected async ensureSubscriptionRetryQueue(
		channel: ConfirmChannel,
		sourceQueueName: string,
		retryQueueName: string,
		retryDelayMs: number,
	) {
		await channel.assertQueue(retryQueueName, {
			durable: true,
			arguments: {
				'x-message-ttl': retryDelayMs,
				'x-dead-letter-exchange': '',
				'x-dead-letter-routing-key': sourceQueueName,
			},
		})
	}

	protected async deadLetterSubscriptionMessage(
		channel: ConfirmChannel,
		subscription: Subscription,
		msg: amqplib.ConsumeMessage,
		reason: string,
	) {
		const deadLetterTarget = this.getSubscriptionDeadLetterTarget(subscription)
		if (!deadLetterTarget) {
			channel.nack(msg, false, false)
			return
		}

		const headers = {
			...(msg.properties.headers ?? {}),
			[DEAD_LETTER_REASON_HEADER]: reason,
		}

		await this.sendToQueueAndConfirm(channel, deadLetterTarget, msg.content, {
			headers,
			contentType: msg.properties.contentType,
			contentEncoding: msg.properties.contentEncoding,
			correlationId: msg.properties.correlationId,
			replyTo: msg.properties.replyTo,
			messageId: msg.properties.messageId,
			timestamp: msg.properties.timestamp,
			type: msg.properties.type,
			appId: msg.properties.appId,
		})
		channel.ack(msg)
	}

	constructor(config?: EventBridgeConfig<AmqpBridgeConfig>) {
		//= getDefaultConfig()
		const conf = {
			...getDefaultConfig(),
			...config,
		}
		super('AmqpBridge', conf)

		this.encoder = {
			...this.encoder,
			...this.config.encoder,
		}

		this.encrypter = {
			...this.encrypter,
			...this.config.encrypter,
		}
		this.capabilities = {
			supportsStreams: false,
			durableCommands: true,
			durableSubscriptions: true,
			manualAckSupported: true,
			lateResponseHandling: EventBridgeLateResponseHandling.IgnoreWithWarning,
			gracefulDrainSupported: true,
			nativeDeadLettering: true,
			commandHandling: {
				transport: EventBridgeCommandTransport.ReplyQueue,
				pendingInvocationCancellation: true,
				responseConfirmation: EventBridgeResponseConfirmationLevel.BrokerConfirm,
				strictMode: true,
			},
			streamHandling: {
				incrementalDelivery: false,
				consumerCancellation: false,
				gracefulStreamDrain: false,
				aggregatedFinalSupported: false,
				lateFrameHandling: EventBridgeStreamLateFrameHandling.NotApplicable,
			},
			consumerFailureHandling: {
				boundedRetry: true,
				delayedRetry: false,
				deadLetterTarget: true,
				drop: true,
				stopConsumer: true,
				consumerPauseResume: true,
				bridgeManagedDeadLettering: true,
				nativeDeadLettering: true,
				fatalClassification: false,
				strictMode: true,
			},
		}
	}

	/**
	 * Indicates if the bridge finished startup and is ready to process traffic.
	 */
	async isReady() {
		return this.ready
	}

	/**
	 * Indicates if the bridge connection and channels are currently healthy.
	 */
	async isHealthy() {
		return this.healthy
	}

	/**
	 * Connect to RabbitMQ broker, ensure exchange, call back queue
	 */
	async start() {
		await super.start()
		try {
			this.connection = await amqplib.connect(this.config.url ?? getDefaultConfig().url, this.config.socketOptions)
		} catch (err) {
			this.logger.fatal({ err }, 'unable to connect to broker')
			throw err
		}

		this.connection.on('error', err => {
			this.healthy = false
			this.logger.error({ err }, 'amqp lib error')
		})
		this.connection.on('close', () => {
			this.healthy = false
			this.ready = false
			this.logger.info('amqp connection disconnected')
		})

		this.logger.info('connected to broker')
		this.channel = await this.createPublishingChannel()

		this.channel.on('close', () => {
			this.healthy = false
			this.ready = false
			this.logger.info('channel closed')
		})

		this.channel.on('error', err => {
			this.healthy = false
			this.logger.error({ err }, 'amqp channel error')
		})

		this.logger.debug('ensured: default exchange')
		await this.channel.assertExchange(
			this.config.exchangeName ?? getDefaultConfig().exchangeName,
			'headers',
			this.config.exchangeOptions,
		)
		const responseQueue = await this.channel.assertQueue('', { exclusive: true, autoDelete: true, durable: false })
		this.replyQueueName = responseQueue.queue
		await this.channel.bindQueue(this.replyQueueName, this.config.exchangeName ?? getDefaultConfig().exchangeName, '', {
			'x-match': 'all',
			replyTo: this.replyQueueName,
		})
		const consume = await this.channel.consume(
			this.replyQueueName,
			async msg => {
				if (!msg) {
					return
				}
				const context = await deserializeOtpFromAmqpHeader(this.logger, msg, this.encrypter, this.encoder)
				return this.startActiveSpan(
					PuristaSpanName.EventBridgeCommandResponseReceived,
					{ kind: SpanKind.CONSUMER },
					context,
					async span => {
						try {
							const message = await this.decodeContent<EBMessage>(
								msg.content,
								msg.properties.contentType,
								msg.properties.contentEncoding,
							)

							if (message.eventName) {
								span.addEvent(message.eventName)
							}

							const log = this.logger.getChildLogger({ customTraceId: message.traceId, ...span.spanContext() })

							if (isCommandResponse(message)) {
								const result = isCommandSuccessResponse(message)
									? this.pendingInvocations.resolve(message.correlationId, message.payload)
									: this.pendingInvocations.reject(
											message.correlationId,
											message.isHandledError ? HandledError.fromMessage(message) : UnhandledError.fromMessage(message),
										)
								if (result !== 'resolved' && result !== 'rejected') {
									if (result === 'late') {
										log.warn(
											{ correlationId: message.correlationId },
											'Ignoring late command response after invocation timeout',
										)
										return
									}
									const err = new UnhandledError(
										StatusCode.BadRequest,
										'InvalidCommandResponse: received invalid command response',
										getCleanedMessage(message),
									)
									span.setStatus({
										code: SpanStatusCode.ERROR,
										message: err.message,
									})
									span.recordException(err)
									log.error({ err }, 'received invalid command response')
									return
								}
								return
							}

							if (isInfoMessage(message)) {
								log.trace('info message', message)
								return
							}

							const err = new UnhandledError(StatusCode.BadRequest, 'InvalidMessage: received invalid message', message)
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: err.message,
							})
							span.recordException(err)
							log.error({ err }, 'received invalid message')
						} catch (error) {
							const err = new HandledError(StatusCode.InternalServerError, 'failed to handle response message', error)
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: err.message,
							})
							span.recordException(err)
							this.logger.error({ err, ...span.spanContext() }, 'failed to handle response message')
						}
					},
				)
			},
			{ noAck: true },
		)

		this.addConsumerRegistration(this.channel, consume.consumerTag)

		this.healthy = true
		this.ready = true
		this.logger.debug('ensured: response queue')

		this.logger.info('amqp event bridge ready')
	}

	/**
	 * Emits a message via AMQP headers exchange.
	 * The message is encoded and encrypted according to configured codecs.
	 */
	async emitMessage<T extends EBMessage>(
		message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>,
		contentType = 'application/json',
		contentEncoding = 'utf-8',
	): Promise<Readonly<EBMessage>> {
		const context = deserializeOtp(this.logger, message.otp)

		const name = isCommandResponse(message as EBMessage)
			? PuristaSpanName.EventBridgeCommandResponseSent
			: PuristaSpanName.EventBridgeEmitMessage

		return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async span => {
			if (!this.channel) {
				const err = new UnhandledError(
					StatusCode.InternalServerError,
					'emit message: failed No channel - not connected',
				)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})
				span.recordException(err)
				this.logger.error({ err, ...span.spanContext() }, err.message)
				throw err
			}

			const msg = Object.freeze({
				...message,
				id: getNewEBMessageId(),
				timestamp: Date.now(),
				traceId: message.traceId,
				otp: serializeOtp(),
				sender: {
					...message.sender,
					instanceId: this.instanceId,
				},
			})

			span.setAttribute(PuristaSpanTag.SenderServiceName, msg.sender.serviceName)
			span.setAttribute(PuristaSpanTag.SenderServiceVersion, msg.sender.serviceVersion)
			span.setAttribute(PuristaSpanTag.SenderServiceTarget, msg.sender.serviceTarget)

			if (msg.eventName) {
				span.addEvent(msg.eventName)
			}

			const headers: Record<string, string | undefined> = {
				messageType: msg.messageType,
				senderServiceName: msg.sender.serviceName,
				senderServiceVersion: msg.sender.serviceVersion,
				senderServiceTarget: msg.sender.serviceTarget,
				senderInstanceId: msg.sender.instanceId,
				eventName: msg.eventName,
				principalId: msg.principalId,
				tenantId: msg.tenantId,
			}

			serializeOtpForAmqpHeader(headers)

			const payload = await this.encodeContent(msg, contentType, contentEncoding)

			await this.channel.publish(this.config.exchangeName ?? getDefaultConfig().exchangeName, '', payload, {
				messageId: msg.id,
				timestamp: msg.timestamp,
				contentType,
				contentEncoding,
				type: msg.messageType,
				headers,
				persistent: true,
			})

			return msg as Readonly<T>
		})
	}

	/**
	 * Invokes a remote command and waits for a matching command response.
	 * The call is rejected with timeout if no response is received in time.
	 */
	async invoke<T>(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		commandTimeout: number = this.defaultCommandTimeout,
	): Promise<T> {
		const context = deserializeOtp(this.logger, input.otp)
		return this.startActiveSpan(
			PuristaSpanName.EventBridgeInvokeCommand,
			{ kind: SpanKind.PRODUCER },
			context,
			async span => {
				if (!this.channel) {
					const err = new UnhandledError(StatusCode.InternalServerError, 'invoke failed: No channel - not connected')
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})
					span.recordException(err)
					this.logger.error({ err, ...span.spanContext() }, err.message)
					throw err
				}

				const correlationId = getNewCorrelationId()

				const command: Command = Object.freeze({
					...input,
					id: getNewEBMessageId(),
					correlationId,
					timestamp: Date.now(),
					messageType: EBMessageType.Command,
					traceId: input.traceId,
					otp: serializeOtp(),
					sender: {
						...input.sender,
						instanceId: this.instanceId,
					},
				})

				const executionPromise = this.pendingInvocations.register(
					correlationId,
					commandTimeout,
					command.traceId,
				) as Promise<T>

				span.setAttribute(PuristaSpanTag.SenderServiceName, command.sender.serviceName)
				span.setAttribute(PuristaSpanTag.SenderServiceVersion, command.sender.serviceVersion)
				span.setAttribute(PuristaSpanTag.SenderServiceTarget, command.sender.serviceTarget)
				span.setAttribute(PuristaSpanTag.ReceiverServiceName, command.receiver.serviceName)
				span.setAttribute(PuristaSpanTag.ReceiverServiceVersion, command.receiver.serviceVersion)
				span.setAttribute(PuristaSpanTag.ReceiverServiceTarget, command.receiver.serviceTarget)

				const headers: Record<string, string | undefined> = {
					messageType: command.messageType,
					senderServiceName: command.sender.serviceName,
					senderServiceVersion: command.sender.serviceVersion,
					senderServiceTarget: command.sender.serviceTarget,
					senderInstanceId: command.sender.instanceId,
					receiverServiceName: command.receiver.serviceName,
					receiverServiceVersion: command.receiver.serviceVersion,
					receiverServiceTarget: command.receiver.serviceTarget,
					eventName: command.eventName,
					principalId: command.principalId,
					tenantId: command.tenantId,
				}
				serializeOtpForAmqpHeader(headers)

				const content = await this.encodeContent(command, 'application/json', 'utf-8')

				try {
					this.channel.publish(this.config.exchangeName ?? getDefaultConfig().exchangeName, '', content, {
						messageId: command.id,
						timestamp: command.timestamp,
						correlationId: command.correlationId,
						expiration: String(Math.max(1, Math.floor(commandTimeout))),
						contentType: 'application/json',
						contentEncoding: 'utf-8',
						type: command.messageType,
						headers,
						replyTo: this.replyQueueName,
						persistent: true,
					})
				} catch (error) {
					const invocationError = UnhandledError.fromError(
						error,
						StatusCode.InternalServerError,
						'invoke failed to publish command',
						command.traceId,
					)
					this.pendingInvocations.reject(correlationId, invocationError)
				}

				return executionPromise
			},
		)
	}

	/**
	 * Register a service function and ensure that there is a queue for all incoming command requests.
	 * @param address The service function address
	 * @param cb the function to call if a matching command message arrives
	 * @returns the id of command function queue
	 */
	async registerCommand(
		address: EBMessageAddress,
		cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
		metadata: CommandDefinitionMetadataBase,
		eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'No connection - not connected')
		}

		const queueName = getCommandQueueName(address, this.config.namePrefix)

		const channel = await this.createPublishingChannel()

		const noAck = eventBridgeConfig.durable ? false : (eventBridgeConfig.autoacknowledge ?? true)
		if (this.config.prefetch && !noAck) {
			await channel.prefetch(this.config.prefetch)
		}

		channel.on('close', () => {
			this.healthy = false
			this.logger.info({ queueName }, 'channel for command closed')
		})

		channel.on('error', err => {
			this.healthy = false
			this.logger.error({ err, queueName }, 'command channel error')
		})

		const queue = await channel.assertQueue(queueName, {
			durable: !!eventBridgeConfig.durable,
			autoDelete: !eventBridgeConfig.durable,
			arguments: eventBridgeConfig.durable
				? {
						...(this.config.deadLetterExchangeName
							? { 'x-dead-letter-exchange': this.config.deadLetterExchangeName }
							: {}),
						...(this.config.deadLetterRoutingKey
							? { 'x-dead-letter-routing-key': this.config.deadLetterRoutingKey }
							: {}),
					}
				: undefined,
		})
		await channel.bindQueue(queue.queue, this.config.exchangeName ?? getDefaultConfig().exchangeName, '', {
			'x-match': 'all',
			messageType: EBMessageType.Command,
			receiverServiceName: address.serviceName,
			receiverServiceVersion: address.serviceVersion,
			receiverServiceTarget: address.serviceTarget,
		})

		const consume = await channel.consume(
			queue.queue,
			async msg => {
				const context = await deserializeOtpFromAmqpHeader(this.logger, msg, this.encrypter, this.encoder)
				return this.runInFlight(
					() =>
						this.startActiveSpan(
							PuristaSpanName.EventBridgeCommandReceived,
							{ kind: SpanKind.CONSUMER },
							context,
							async span => {
								if (!msg) {
									return
								}
								try {
									const command = await this.decodeContent<Command>(
										msg.content,
										msg.properties.contentType,
										msg.properties.contentEncoding,
									)

									command.otp = serializeOtp()

									const result = await cb(command)

									const returnContext = deserializeOtp(this.logger, result.otp)
									return this.startActiveSpan(
										PuristaSpanName.EventBridgeCommandResponseSent,
										{ kind: SpanKind.PRODUCER },
										returnContext,
										async subSpan => {
											const responseMessage = {
												...result,
												otp: serializeOtp(),
												sender: {
													...result.sender,
													instanceId: this.instanceId,
												},
											}

											subSpan.setAttribute(PuristaSpanTag.SenderServiceName, responseMessage.sender.serviceName)
											subSpan.setAttribute(PuristaSpanTag.SenderServiceVersion, responseMessage.sender.serviceVersion)
											subSpan.setAttribute(PuristaSpanTag.SenderServiceTarget, responseMessage.sender.serviceTarget)

											if (responseMessage.eventName) {
												subSpan.addEvent(responseMessage.eventName)
											}

											const headers: Record<string, string | undefined> = {
												messageType: responseMessage.messageType,
												senderServiceName: responseMessage.sender.serviceName,
												senderServiceVersion: responseMessage.sender.serviceVersion,
												senderServiceTarget: responseMessage.sender.serviceTarget,
												senderInstanceId: responseMessage.sender.instanceId,
												receiverServiceName: responseMessage.receiver.serviceName,
												receiverServiceVersion: responseMessage.receiver.serviceVersion,
												receiverServiceTarget: responseMessage.receiver.serviceTarget,
												receiverServiceInstanceId: responseMessage.receiver.instanceId,
												replyTo: msg.properties.replyTo,
												eventName: responseMessage.eventName,
												principalId: responseMessage.principalId,
												tenantId: responseMessage.tenantId,
											}

											serializeOtpForAmqpHeader(headers)

											const contentType = 'application/json'
											const contentEncoding = 'utf-8'

											const payload = await this.encodeContent(responseMessage, contentType, contentEncoding)

											channel.publish(this.config.exchangeName ?? getDefaultConfig().exchangeName, '', payload, {
												messageId: responseMessage.id,
												timestamp: responseMessage.timestamp,
												correlationId: msg.properties.correlationId,
												contentType,
												contentEncoding,
												type: responseMessage.messageType,
												headers,
												persistent: true,
											})

											if (!noAck) {
												channel.ack(msg)
											}
										},
									)
								} catch (error) {
									const err = new UnhandledError(
										StatusCode.InternalServerError,
										'Failed to consume command response message',
										{
											error,
										},
									)
									span.setStatus({
										code: SpanStatusCode.ERROR,
										message: err.message,
									})
									span.recordException(err)
									this.logger.error({ err }, 'Failed to consume command response message')
									if (!noAck) {
										channel.nack(msg)
									}
								}
							},
						),
					'command',
				)
			},
			{ noAck },
		)

		this.addConsumerRegistration(channel, consume.consumerTag)

		this.serviceFunctions.set(queueName, { cb, channel })

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

	/**
	 * Unregisters a command consumer and closes the dedicated command channel.
	 */
	async unregisterCommand(address: EBMessageAddress): Promise<void> {
		try {
			const queueName = getCommandQueueName(address, this.config.namePrefix)
			const entry = this.serviceFunctions.get(queueName)
			if (!entry) {
				return
			}
			await entry.channel.close()
			this.removeConsumerRegistrationsForChannel(entry.channel)
			if (!this.serviceFunctions.delete(queueName)) {
				this.logger.error({ queueName, address }, 'Failed to clean unregister service command')
			}
		} catch (error) {
			const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to unregister service function', {
				error,
				address,
			})
			this.logger.error({ err }, 'Failed to unregister service function')
		}
	}

	/**
	 * Registers a subscription consumer and returns its stable subscription key.
	 */
	async registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'No connection - not connected')
		}

		const noAck = !!subscription.eventBridgeConfig.autoacknowledge
		const failureHandling = subscription.eventBridgeConfig.consumerFailureHandling

		const isShared = subscription.eventBridgeConfig.shared === undefined || subscription.eventBridgeConfig.shared

		const queueName = isShared ? getSubscriptionQueueName(subscription.subscriber, this.config.namePrefix) : ''
		const subscriptionStorageKey = getSubscriptionQueueName(subscription.subscriber, this.config.namePrefix)

		const queueOptions: amqplib.Options.AssertQueue = isShared
			? {
					durable: subscription.eventBridgeConfig.durable,
				}
			: { exclusive: true, autoDelete: true, durable: false }

		const channel = await this.createPublishingChannel()

		channel.on('close', () => {
			this.healthy = false
			this.logger.info({ queueName }, 'channel for subscription closed')
		})

		channel.on('error', err => {
			this.healthy = false
			this.logger.error({ err, queueName }, 'subscription channel error')
		})

		const queue = await channel.assertQueue(queueName, queueOptions)
		await channel.bindQueue(queue.queue, this.config.exchangeName ?? getDefaultConfig().exchangeName, '', {
			'x-match': 'all',
			messageType: subscription.messageType,
			senderServiceName: subscription.sender?.serviceName,
			senderServiceVersion: subscription.sender?.serviceVersion,
			senderServiceTarget: subscription.sender?.serviceTarget,
			senderInstanceId: subscription.sender?.instanceId,
			receiverServiceName: subscription.receiver?.serviceName,
			receiverServiceVersion: subscription.receiver?.serviceVersion,
			receiverServiceTarget: subscription.receiver?.serviceTarget,
			receiverInstanceId: subscription.receiver?.instanceId,
			eventName: subscription.eventName,
			principalId: subscription.principalId,
			tenantId: subscription.tenantId,
		})
		const consumeHandler = async (msg: amqplib.ConsumeMessage | null) => {
			const context = await deserializeOtpFromAmqpHeader(this.logger, msg, this.encrypter, this.encoder)

			const spanContext = context ? trace.getSpanContext(context) : undefined
			return this.runInFlight(
				() =>
					this.startActiveSpan(
						PuristaSpanName.EventBridgeSubscriptionEventReceived,
						{ kind: SpanKind.CONSUMER, links: spanContext ? [{ context: spanContext }] : [] },
						context,
						async span => {
							if (!msg) {
								return
							}
							try {
								const message = await this.decodeContent<EBMessage>(
									msg.content,
									msg.properties.contentType,
									msg.properties.contentEncoding,
								)

								span.setAttribute(PuristaSpanTag.SenderServiceName, message.sender.serviceName)
								span.setAttribute(PuristaSpanTag.SenderServiceVersion, message.sender.serviceVersion)
								span.setAttribute(PuristaSpanTag.SenderServiceTarget, message.sender.serviceTarget)

								if (message.eventName) {
									span.addEvent(message.eventName)
								}

								message.otp = serializeOtp()

								const result = await cb(message)
								if (subscription.emitEventName && result) {
									await this.emitMessage(result)
								}
								if (!noAck) {
									channel.ack(msg)
								}
							} catch (error) {
								if (error instanceof SubscriptionConsumerControlError) {
									if (!noAck) {
										if (error.outcome === 'deadLetter') {
											try {
												await this.deadLetterSubscriptionMessage(
													channel,
													subscription,
													msg,
													error.reason ?? 'subscription requested dead-letter',
												)
											} catch (handoffError) {
												this.logger.error(
													{
														err: handoffError,
														queueName: queue.queue,
														subscriptionKey: subscriptionStorageKey,
													},
													'Failed to hand off AMQP subscription message to dead-letter target',
												)
											}
											return
										}
										if (error.outcome === 'retry') {
											try {
												const attempt = this.getConsumerAttempt(msg.properties.headers)
												const retryDelayMs = error.delayMs ?? failureHandling?.retryDelayMs ?? 0
												await this.retrySubscriptionMessage(
													channel,
													queue.queue,
													msg,
													attempt + 1,
													retryDelayMs,
													!!subscription.eventBridgeConfig.durable,
												)
											} catch (handoffError) {
												this.logger.error(
													{
														err: handoffError,
														queueName: queue.queue,
														subscriptionKey: subscriptionStorageKey,
													},
													'Failed to hand off AMQP subscription message to retry queue',
												)
											}
											return
										}
										if (error.outcome === 'drop') {
											this.logger.warn(
												{
													queueName: queue.queue,
													subscriptionKey: subscriptionStorageKey,
													reason: error.reason,
												},
												'Dropping AMQP subscription message by PURISTA control signal',
											)
											channel.ack(msg)
											return
										}
										if (error.outcome === 'stop-consumer') {
											this.pausedSubscriptionConsumers.set(subscriptionStorageKey, {
												pausedAt: Date.now(),
												reason: error.reason ?? 'paused_by_subscription_handler',
											})
											this.logger.warn(
												{
													queueName: queue.queue,
													subscriptionKey: subscriptionStorageKey,
													reason: error.reason,
												},
												'Paused AMQP subscription consumer by PURISTA control signal',
											)
											channel.nack(msg, false, true)
											const currentTag = this.subscriptions.get(subscriptionStorageKey)?.consumerTag
											if (currentTag) {
												await channel.cancel(currentTag)
												this.removeConsumerRegistration(channel, currentTag)
												const entry = this.subscriptions.get(subscriptionStorageKey)
												if (entry) {
													entry.consumerTag = undefined
												}
											}
											return
										}
									}
									return
								}
								const err = new UnhandledError(
									StatusCode.InternalServerError,
									'Failed to consume subscription message',
									{
										error,
										subscription,
									},
								)
								span.setStatus({
									code: SpanStatusCode.ERROR,
									message: err.message,
								})
								span.recordException(err)
								this.logger.error({ err }, 'Failed to consume subscription message')
								if (!noAck) {
									const failureReason = this.getSubscriptionFailureReason(err)
									if (failureHandling) {
										const attempt = this.getConsumerAttempt(msg.properties.headers)
										if (attempt >= (failureHandling.maxAttempts ?? 5)) {
											try {
												await this.deadLetterSubscriptionMessage(channel, subscription, msg, failureReason)
											} catch (handoffError) {
												this.logger.error(
													{
														err: handoffError,
														queueName: queue.queue,
														subscriptionKey: subscriptionStorageKey,
													},
													'Failed to hand off AMQP subscription message to dead-letter target',
												)
											}
										} else {
											const retryDelayMs = failureHandling.retryDelayMs ?? 0
											try {
												await this.retrySubscriptionMessage(
													channel,
													queue.queue,
													msg,
													attempt + 1,
													retryDelayMs,
													!!subscription.eventBridgeConfig.durable,
												)
											} catch (handoffError) {
												this.logger.error(
													{
														err: handoffError,
														queueName: queue.queue,
														subscriptionKey: subscriptionStorageKey,
													},
													'Failed to hand off AMQP subscription message to retry queue',
												)
											}
										}
									} else {
										channel.nack(msg)
									}
								}
							}
						},
					),
				'subscription',
			)
		}
		const consume = await channel.consume(queue.queue, consumeHandler, { noAck })

		this.addConsumerRegistration(channel, consume.consumerTag)

		this.subscriptions.set(subscriptionStorageKey, {
			cb,
			channel,
			queueName: queue.queue,
			subscription,
			noAck,
			consumeHandler,
			consumerTag: consume.consumerTag,
		})
		return subscriptionStorageKey
	}

	/**
	 * Unregisters a subscription consumer and closes its channel.
	 */
	async unregisterSubscription(address: EBMessageAddress): Promise<void> {
		try {
			const queueName = getSubscriptionQueueName(address, this.config.namePrefix)
			const entry = this.subscriptions.get(queueName)
			if (!entry) {
				return
			}
			await entry.channel.close()
			this.removeConsumerRegistrationsForChannel(entry.channel)
			if (!this.subscriptions.delete(queueName)) {
				this.logger.error({ queueName, address }, 'Failed to clean unregister subscription function')
			}
			this.pausedSubscriptionConsumers.delete(queueName)
		} catch (error) {
			const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to unregister subscription', {
				error,
				address,
			})
			this.logger.error({ err }, 'Failed to unregister subscription')
		}
	}

	getPausedSubscriptionConsumers() {
		return Object.fromEntries(this.pausedSubscriptionConsumers.entries())
	}

	async resumeSubscriptionConsumer(registrationKey: string) {
		const entry = this.subscriptions.get(registrationKey)
		if (!entry) {
			return
		}
		if (!this.pausedSubscriptionConsumers.has(registrationKey)) {
			return
		}
		if (entry.consumerTag) {
			this.pausedSubscriptionConsumers.delete(registrationKey)
			return
		}
		const consume = await entry.channel.consume(entry.queueName, entry.consumeHandler, {
			noAck: entry.noAck,
		})
		entry.consumerTag = consume.consumerTag
		this.addConsumerRegistration(entry.channel, consume.consumerTag)
		this.pausedSubscriptionConsumers.delete(registrationKey)
		this.logger.info({ registrationKey }, 'Resumed paused AMQP subscription consumer')
	}

	/**
	 * Encode given payload to buffer
	 * @param input
	 * @param contentType
	 * @param contentEncoding
	 * @returns
	 */
	protected async encodeContent<T>(input: T, contentType: string, contentEncoding: string): Promise<Buffer> {
		const encoder = this.encoder[contentType]
		if (!encoder) {
			throw new Error(`Encode not defined for ${contentType}`)
		}
		const encodedPayload = await encoder.encode(input)

		const encrypter = this.encrypter[contentEncoding]
		if (!encrypter) {
			throw new Error(`Encrypt not defined for ${contentEncoding}`)
		}
		return encrypter.encrypt(encodedPayload)
	}

	/**
	 * Decode buffer into given type
	 * @param input the input buffer
	 * @param contentType the content type of buffer content
	 * @param contentEncoding the encoding type of buffer content
	 * @returns
	 */
	protected async decodeContent<T>(input: Buffer, contentType: string, contentEncoding: string): Promise<T> {
		const decrypter = this.encrypter[contentEncoding]
		if (!decrypter) {
			throw new Error(`Decrypt not defined for ${contentEncoding}`)
		}

		const decrypted = await decrypter.decrypt(input)

		const decoder = this.encoder[contentType]
		if (!decoder) {
			throw new Error(`Decode not defined for ${contentType}`)
		}
		return decoder.decode(decrypted)
	}

	/**
	 * Gracefully stops all consumers, waits for in-flight subscription handlers,
	 * closes AMQP resources and rejects unresolved pending invocations.
	 */
	async destroy() {
		if (this.channel) {
			// instruct message broker to no longer send messages
			await Promise.allSettled(this.consumerRegistrations.map(entry => entry.channel.cancel(entry.tag)))
			this.consumerRegistrations = []
			this.pausedSubscriptionConsumers.clear()

			let isTimedOut = false
			const timeout = setTimeout(() => {
				isTimedOut = true
			}, this.defaultCommandTimeout)

			// ensure actual running commands and subscriptions are finished before closing connection
			await new Promise<void>(resolve => {
				const waitForExecutionEnd = () => {
					if (this.getInFlightExecutionCount() <= 0) {
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

			await this.channel.close()
		}
		if (this.connection) {
			await this.connection.close()
		}
		this.pendingInvocations.rejectAll(new UnhandledError(StatusCode.ServiceUnavailable))
		this.healthy = false
		this.ready = false

		await super.destroy()
	}
}
