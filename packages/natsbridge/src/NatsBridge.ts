import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import type {
	BrokerHeaderCommandMsg,
	BrokerHeaderCustomMsg,
	Command,
	CommandDefinitionMetadataBase,
	CommandErrorResponse,
	CommandResponse,
	CommandSuccessResponse,
	CustomMessage,
	DefinitionEventBridgeConfig,
	DefinitionEventBridgeConsumerFailureHandling,
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
	EventBridgeLateResponseHandling,
	getNewCorrelationId,
	getNewEBMessageId,
	HandledError,
	isCommandResponse,
	isCommandSuccessResponse,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	serializeOtp,
	UnhandledError,
} from '@purista/core'
import type {
	JetStreamClient,
	JetStreamManager,
	JetStreamSubscription,
	JsMsg,
	Msg,
	MsgHdrs,
	NatsConnection,
	NatsError,
	Subscription as NatsSubscription,
} from 'nats'
import {
	connect,
	consumerOpts,
	createInbox,
	headers as getNewHeaders,
	JSONCodec,
	RetentionPolicy,
	StorageType,
} from 'nats'

import { deserializeOtpFromNats } from './deserializeOtpFromNats.impl.js'
import { getDefaultNatsBridgeConfig } from './getDefaultNatsBridgeConfig.js'
import { getQueueGroupName } from './getQueueGroupName.impl.js'
import { getCommandHandler } from './handler/getCommandHandler.impl.js'
import { getSubscriptionHandler } from './handler/getSubscriptionHandler.impl.js'

import { serializeOtpToNats } from './serializeOtpToNats.impl.js'
import { getCommandSubscriptionTopic } from './topic/getCommandSubscriptionTopic.impl.js'
import { getSubscriptionTopic } from './topic/getSubscriptionTopic.impl.js'
import { getTopicName } from './topic/getTopicName.impl.js'

import type { NatsBridgeConfig } from './types/NatsBridgeConfig.js'

const DEAD_LETTER_REASON_HEADER = 'x-purista-dead-letter-reason'
const DEAD_LETTER_ATTEMPT_HEADER = 'x-purista-dead-letter-attempt'
const DEAD_LETTER_ORIGINAL_SUBJECT_HEADER = 'x-purista-dead-letter-original-subject'
const DEAD_LETTER_SUBSCRIBER_HEADER = 'x-purista-dead-letter-subscriber'

type ResolvedConsumerFailureHandling = {
	maxAttempts: number
	retryDelayMs: number
	deadLetterTarget: string
}

/**
The event bridge supports low-latency core NATS messaging.

When JetStream is available, durable command and subscription registrations use
JetStream consumers. Without JetStream, durable requests fail fast by default
(`durableSubscriptionMode: 'strict'`) instead of silently degrading to
non-durable core NATS semantics.

Example usage:

@example
* ```typescript
import { NatsBridge } from '@purista/natsbridge'

// create and init our eventbridge
  const eventBridge = new NatsBridge()
  await eventBridge.start()

```
 */
export class NatsBridge extends EventBridgeBaseClass<NatsBridgeConfig> implements EventBridge {
	public connection: NatsConnection | undefined

	public isJetStreamEnabled = false

	public jsm: JetStreamManager | undefined
	public js: JetStreamClient | undefined

	commands = new Map<string, JetStreamSubscription | NatsSubscription>()
	subscriptions = new Map<string, JetStreamSubscription | NatsSubscription>()

	sc = JSONCodec()

	constructor(config?: EventBridgeConfig<Partial<NatsBridgeConfig>>) {
		const conf = {
			...getDefaultNatsBridgeConfig(),
			...config,
		}

		super('NatsBridge', conf)
		this.capabilities = {
			supportsStreams: false,
			durableCommands: false,
			durableSubscriptions: false,
			manualAckSupported: false,
			lateResponseHandling: EventBridgeLateResponseHandling.NotApplicable,
			gracefulDrainSupported: true,
			nativeDeadLettering: false,
		}
	}

	private requiresJetStreamConsumer(kind: 'command' | 'subscription', eventBridgeConfig: DefinitionEventBridgeConfig) {
		if (kind === 'command') {
			return eventBridgeConfig.durable
		}

		return (
			eventBridgeConfig.durable ||
			!eventBridgeConfig.autoacknowledge ||
			eventBridgeConfig.consumerFailureHandling !== undefined
		)
	}

	private shouldUseJetStreamConsumer(kind: 'command' | 'subscription', eventBridgeConfig: DefinitionEventBridgeConfig) {
		if (!this.requiresJetStreamConsumer(kind, eventBridgeConfig)) {
			return false
		}
		if (this.isJetStreamEnabled && this.jsm && this.js) {
			return true
		}
		if (this.config.durableSubscriptionMode === 'best-effort') {
			this.logger.warn(
				{ kind, eventBridgeConfig },
				'Falling back to core NATS semantics because JetStream-backed acknowledgements are unavailable',
			)
			return false
		}
		throw new UnhandledError(
			StatusCode.NotImplemented,
			`NATS ${kind} registration requires JetStream support for the requested delivery semantics`,
		)
	}

	private getRegistrationKey(address: EBMessageAddress) {
		return `${address.serviceName}-${address.serviceVersion},${address.serviceTarget}`
	}

	private sanitizeName(input: string) {
		return input.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 200)
	}

	private getJetStreamStreamName(kind: 'command' | 'subscription', subject: string) {
		return this.sanitizeName(`${this.config.topicPrefix}_${kind}_${subject}`)
	}

	private getJetStreamConsumerName(kind: 'command' | 'subscription', address: EBMessageAddress, shared: boolean) {
		const base = `${kind}_${address.serviceName}_${address.serviceVersion}_${address.serviceTarget}`
		return this.sanitizeName(shared ? base : `${base}_${this.instanceId}`)
	}

	private resolveConsumerFailureHandling(
		subject: string,
		config?: DefinitionEventBridgeConsumerFailureHandling,
	): ResolvedConsumerFailureHandling {
		const maxAttempts = config?.maxAttempts ?? this.config.defaultConsumerFailureHandling.maxAttempts
		const retryDelayMs = config?.retryDelayMs ?? this.config.defaultConsumerFailureHandling.retryDelayMs
		const deadLetterTarget =
			config?.deadLetterTarget ?? `${subject}${this.config.defaultConsumerFailureHandling.deadLetterSuffix}`

		if (maxAttempts < 1) {
			throw new UnhandledError(StatusCode.BadRequest, 'consumer failure handling maxAttempts must be greater than 0')
		}
		if (retryDelayMs < 0) {
			throw new UnhandledError(
				StatusCode.BadRequest,
				'consumer failure handling retryDelayMs must be greater than or equal to 0',
			)
		}

		return {
			maxAttempts,
			retryDelayMs,
			deadLetterTarget,
		}
	}

	private getFailureReason(error: unknown) {
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

	private async publishDeadLetterMessage(
		subject: string,
		address: EBMessageAddress,
		msg: JsMsg,
		reason: string,
		failureHandling: ResolvedConsumerFailureHandling,
	) {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}

		await this.ensureJetStreamStream(failureHandling.deadLetterTarget, 'subscription')

		let headers: MsgHdrs | undefined
		if (this.connection.info?.headers) {
			headers = getNewHeaders()
			headers.set(DEAD_LETTER_REASON_HEADER, reason)
			headers.set(DEAD_LETTER_ATTEMPT_HEADER, String(msg.info.deliveryCount))
			headers.set(DEAD_LETTER_ORIGINAL_SUBJECT_HEADER, subject)
			headers.set(
				DEAD_LETTER_SUBSCRIBER_HEADER,
				`${address.serviceName}/${address.serviceVersion}/${address.serviceTarget}`,
			)
		}

		this.connection.publish(failureHandling.deadLetterTarget, msg.data, { headers })
	}

	private async ensureJetStreamStream(subject: string, kind: 'command' | 'subscription') {
		if (!this.jsm) {
			throw new UnhandledError(StatusCode.NotImplemented, 'JetStream manager is not available')
		}
		try {
			return await this.jsm.streams.find(subject)
		} catch {
			const streamName = this.getJetStreamStreamName(kind, subject)
			try {
				await this.jsm.streams.add({
					name: streamName,
					subjects: [subject],
					retention: kind === 'command' ? RetentionPolicy.Workqueue : RetentionPolicy.Interest,
					storage: StorageType.File,
				})
			} catch (error) {
				this.logger.debug(
					{ err: error instanceof Error ? error.message : String(error), streamName, subject },
					'JetStream stream creation raced or already existed',
				)
			}
			return this.jsm.streams.find(subject)
		}
	}

	private async registerJetStreamConsumer(
		kind: 'command' | 'subscription',
		subject: string,
		address: EBMessageAddress,
		shared: boolean,
		eventBridgeConfig: DefinitionEventBridgeConfig,
		handler: (error: NatsError | null, msg: Msg | JsMsg) => Promise<unknown>,
	) {
		if (!this.js) {
			throw new UnhandledError(StatusCode.NotImplemented, 'JetStream client is not available')
		}

		const stream = await this.ensureJetStreamStream(subject, kind)
		const durableName = this.getJetStreamConsumerName(kind, address, shared)
		const failureHandling =
			kind === 'subscription'
				? this.resolveConsumerFailureHandling(subject, eventBridgeConfig.consumerFailureHandling)
				: undefined
		const opts = consumerOpts()
			.bindStream(stream)
			.durable(durableName)
			.deliverNew()
			.deliverTo(createInbox())
			.manualAck()
			.ackExplicit()
			.ackWait(this.defaultCommandTimeout)
			.maxAckPending(this.config.maxMessages)
			.filterSubject(subject)
			.maxDeliver(failureHandling?.maxAttempts ?? 1)
			.callback((error, msg) => {
				if (error) {
					this.logger.error({ err: error, subject, durableName, kind }, 'JetStream consumer callback failed')
					return
				}
				if (!msg) {
					this.logger.warn({ subject, durableName, kind }, 'JetStream consumer callback invoked without a message')
					return
				}

				void handler(null, msg)
					.then(() => {
						msg.ack()
					})
					.catch(async err => {
						this.logger.error({ err, subject, durableName, kind }, 'JetStream consumer handler failed')

						if (kind === 'subscription' && failureHandling) {
							if (msg.info.deliveryCount >= failureHandling.maxAttempts) {
								try {
									await this.publishDeadLetterMessage(
										subject,
										address,
										msg,
										this.getFailureReason(err),
										failureHandling,
									)
									msg.term(`dead-lettered by PURISTA after ${msg.info.deliveryCount} attempts`)
									return
								} catch (deadLetterError) {
									this.logger.error(
										{
											err: deadLetterError,
											subject,
											durableName,
											deadLetterTarget: failureHandling.deadLetterTarget,
										},
										'Failed to publish JetStream dead-letter message',
									)
								}
							}

							msg.nak(failureHandling.retryDelayMs)
							return
						}

						msg.nak()
					})
			})

		if (shared) {
			const queue = getQueueGroupName(this.config.topicPrefix, address)
			opts.queue(queue).deliverGroup(queue)
		}

		return this.js.subscribe(subject, opts)
	}

	async start() {
		const conf = { ...this.config, name: this.instanceId }
		this.connection = await connect(conf)

		this.isJetStreamEnabled = !!this.connection.info?.jetstream

		if (this.isJetStreamEnabled) {
			this.jsm = await this.connection.jetstreamManager()
			this.js = this.connection.jetstream()
		}
		this.capabilities.durableCommands = this.isJetStreamEnabled
		this.capabilities.durableSubscriptions = this.isJetStreamEnabled
		this.capabilities.manualAckSupported = this.isJetStreamEnabled
	}

	async isReady() {
		return !this.connection?.isClosed() && !this.connection?.isDraining()
	}

	async isHealthy() {
		return !this.connection?.isClosed() && !this.connection?.isDraining()
	}

	async emitMessage<T extends EBMessage>(
		message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>,
		contentType = 'application/json',
		contentEncoding = 'utf-8',
	): Promise<Readonly<EBMessage>> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}

		const context = deserializeOtp(this.logger, message.otp)

		const name = isCommandResponse(message as EBMessage)
			? PuristaSpanName.EventBridgeCommandResponseSent
			: PuristaSpanName.EventBridgeEmitMessage

		return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async span => {
			const msg = Object.freeze({
				...message,
				sender: {
					...message.sender,
					instanceId: this.instanceId,
				},
				id: getNewEBMessageId(),
				timestamp: Date.now(),
				traceId: message.traceId,
				otp: serializeOtp(),
				contentType,
				contentEncoding,
			}) as EBMessage

			span.setAttribute(PuristaSpanTag.SenderServiceName, msg.sender.serviceName)
			span.setAttribute(PuristaSpanTag.SenderServiceVersion, msg.sender.serviceVersion)
			span.setAttribute(PuristaSpanTag.SenderServiceTarget, msg.sender.serviceTarget)

			if (msg.eventName) {
				span.addEvent(msg.eventName)
			}

			let headers: MsgHdrs | undefined
			if (this.connection?.info?.headers) {
				headers = getNewHeaders()
				const userProperties: BrokerHeaderCustomMsg = serializeOtpToNats({
					messageType: msg.messageType,
					senderServiceName: msg.sender.serviceName,
					senderServiceVersion: msg.sender.serviceVersion,
					senderServiceTarget: msg.sender.serviceTarget,
					senderInstanceId: msg.sender.instanceId,
				})

				if (msg.eventName) {
					userProperties.eventName = msg.eventName
				}

				if (msg.principalId) {
					userProperties.principalId = msg.principalId
				}

				if (msg.tenantId) {
					userProperties.tenantId = msg.tenantId
				}

				for (const value of Object.entries(userProperties)) {
					headers?.set(value[0], value[1])
				}
			}
			const topic = getTopicName.bind(this)(msg)

			this.connection?.publish(topic, this.sc.encode(msg), { headers })

			return msg as Readonly<T>
		})
	}

	async invoke<T>(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		commandTimeout: number = this.defaultCommandTimeout,
	): Promise<T> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}

		const context = deserializeOtp(this.logger, input.otp)
		return this.startActiveSpan(
			PuristaSpanName.EventBridgeInvokeCommand,
			{ kind: SpanKind.PRODUCER },
			context,
			async span => {
				const correlationId = getNewCorrelationId()

				if (!this.connection) {
					throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
				}

				const command: Command = Object.freeze({
					...input,
					sender: {
						...input.sender,
						instanceId: this.instanceId,
					},
					id: getNewEBMessageId(),
					correlationId,
					timestamp: Date.now(),
					messageType: EBMessageType.Command,
					traceId: input.traceId,
					otp: serializeOtp(),
				})

				const log = this.logger.getChildLogger({ ...span.spanContext(), customTraceId: command.traceId })

				span.setAttribute(PuristaSpanTag.SenderServiceName, command.sender.serviceName)
				span.setAttribute(PuristaSpanTag.SenderServiceVersion, command.sender.serviceVersion)
				span.setAttribute(PuristaSpanTag.SenderServiceTarget, command.sender.serviceTarget)
				span.setAttribute(PuristaSpanTag.ReceiverServiceName, command.receiver.serviceName)
				span.setAttribute(PuristaSpanTag.ReceiverServiceVersion, command.receiver.serviceVersion)
				span.setAttribute(PuristaSpanTag.ReceiverServiceTarget, command.receiver.serviceTarget)

				let headers: MsgHdrs | undefined
				if (this.connection?.info?.headers) {
					headers = getNewHeaders()
					const userProperties: BrokerHeaderCommandMsg = serializeOtpToNats({
						messageType: command.messageType,
						senderServiceName: command.sender.serviceName,
						senderServiceVersion: command.sender.serviceVersion,
						senderServiceTarget: command.sender.serviceTarget,
						senderInstanceId: command.sender.instanceId,
						receiverServiceName: command.receiver.serviceName,
						receiverServiceVersion: command.receiver.serviceVersion,
						receiverServiceTarget: command.receiver.serviceTarget,
					})

					if (command.eventName) {
						userProperties.eventName = command.eventName
					}

					if (command.receiver.instanceId) {
						userProperties.receiverInstanceId = command.receiver.instanceId
					}

					if (command.principalId) {
						userProperties.principalId = command.principalId
					}

					if (command.tenantId) {
						userProperties.tenantId = command.tenantId
					}

					for (const value of Object.entries(userProperties)) {
						headers?.set(value[0], value[1])
					}
				}

				const topic = getTopicName.bind(this)(command)

				const data = this.sc.encode(command)

				try {
					const msg = await this.connection.request(topic, data, {
						timeout: commandTimeout,
					})

					const response: CommandResponse = this.sc.decode(msg.data) as CommandResponse
					const returnContext = deserializeOtpFromNats(this.logger, response, msg.headers)
					return this.startActiveSpan(
						PuristaSpanName.EventBridgeCommandResponseReceived,
						{ kind: SpanKind.CONSUMER },
						returnContext,
						async returnSpan => {
							const responseLog = this.logger.getChildLogger({ ...span.spanContext(), customTraceId: response.traceId })

							if (response.eventName) {
								returnSpan.addEvent(response.eventName)
							}

							if (!isCommandResponse(response)) {
								const err = new UnhandledError(
									StatusCode.InternalServerError,
									'the received message is not a command response',
								)
								responseLog.error({ err }, err.message)
								returnSpan.setStatus({
									code: SpanStatusCode.ERROR,
									message: err.message,
								})
								returnSpan.recordException(err)
								throw err
							}

							if (isCommandSuccessResponse(response)) {
								return response.payload as T
							}
							const error = response.isHandledError
								? HandledError.fromMessage(response)
								: UnhandledError.fromMessage(response)

							returnSpan.setStatus({
								code: SpanStatusCode.ERROR,
								message: error.message,
							})
							returnSpan.recordException(error)
							responseLog.error({ err: error }, error.message)
							throw error
						},
					)
				} catch (error) {
					if (error instanceof HandledError || error instanceof UnhandledError) {
						throw error
					}
					const err = UnhandledError.fromError(error)
					log.error({ err })
					throw err
				}
			},
		)
	}

	async registerCommand(
		address: EBMessageAddress,
		cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
		metadata: CommandDefinitionMetadataBase,
		eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}
		const topic = getCommandSubscriptionTopic.bind(this)(address)
		const callback = getCommandHandler(address, cb, metadata, eventBridgeConfig).bind(this)
		const registrationKey = this.getRegistrationKey(address)
		const subscription = this.shouldUseJetStreamConsumer('command', eventBridgeConfig)
			? await this.registerJetStreamConsumer(
					'command',
					topic,
					address,
					eventBridgeConfig.shared,
					eventBridgeConfig,
					callback,
				)
			: this.connection.subscribe(topic, { callback, queue: getQueueGroupName(this.config.topicPrefix, address) })

		this.commands.set(registrationKey, subscription)

		const info = createInfoMessage(
			EBMessageType.InfoServiceFunctionAdded,
			{ ...address, instanceId: this.instanceId },
			{
				payload: metadata,
			},
		)
		await this.emitMessage(info)

		return topic
	}

	async unregisterCommand(address: EBMessageAddress): Promise<void> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}

		const registrationKey = this.getRegistrationKey(address)
		const subscription = this.commands.get(registrationKey)
		const destroyableSubscription = subscription as Partial<JetStreamSubscription> | undefined

		subscription?.unsubscribe()
		if (typeof destroyableSubscription?.destroy === 'function') {
			await destroyableSubscription.destroy()
		} else {
			await subscription?.drain()
		}
		this.commands.delete(registrationKey)
	}

	async registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}
		const topic = getSubscriptionTopic.bind(this)(subscription)
		const callback = getSubscriptionHandler(subscription, cb).bind(this)
		const registrationKey = this.getRegistrationKey(subscription.subscriber)
		const natsSubscription = this.shouldUseJetStreamConsumer('subscription', subscription.eventBridgeConfig)
			? await this.registerJetStreamConsumer(
					'subscription',
					topic,
					subscription.subscriber,
					subscription.eventBridgeConfig.shared,
					subscription.eventBridgeConfig,
					callback,
				)
			: this.connection.subscribe(topic, {
					callback,
					queue: subscription.eventBridgeConfig.shared
						? getQueueGroupName(this.config.topicPrefix, subscription.subscriber)
						: undefined,
				})
		this.subscriptions.set(registrationKey, natsSubscription)

		return topic
	}

	async unregisterSubscription(address: EBMessageAddress): Promise<void> {
		if (!this.connection) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
		}

		const registrationKey = this.getRegistrationKey(address)
		const subscription = this.subscriptions.get(registrationKey)
		const destroyableSubscription = subscription as Partial<JetStreamSubscription> | undefined

		subscription?.unsubscribe()
		if (typeof destroyableSubscription?.destroy === 'function') {
			await destroyableSubscription.destroy()
		} else {
			await subscription?.drain()
		}
		this.subscriptions.delete(registrationKey)
	}

	async destroy() {
		const drained = await this.waitForInFlightDrain()
		if (!drained) {
			this.logger.error('Some NATS command or subscription handlers did not finish before shutdown')
		}

		await this.connection?.drain()
		await this.connection?.close()
		await super.destroy()
	}
}
