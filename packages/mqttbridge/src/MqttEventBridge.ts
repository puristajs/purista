import { SpanKind } from '@opentelemetry/api'
import type {
	BrokerHeaderCommandMsg,
	BrokerHeaderCustomMsg,
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
	EventBridgeLateResponseHandling,
	getNewCorrelationId,
	getNewEBMessageId,
	getNewInstanceId,
	isCommandResponse,
	PendingInvocationRegistry,
	PuristaSpanName,
	PuristaSpanTag,
	StatusCode,
	serializeOtp,
	UnhandledError,
} from '@purista/core'
import type { IClientSubscribeOptions, IPublishPacket, MqttClient } from 'mqtt'
import { connectAsync } from 'mqtt'

import { getDefaultMqttBridgeConfig } from './getDefaultMqttBridgeConfig.impl.js'
import { getCommandHandler } from './handler/getCommandHandler.impl.js'
import { getSubscriptionHandler } from './handler/getSubscriptionHandler.impl.js'
import { handleCommandResponse } from './handler/handleCommandResponse.impl.js'
import { msToSec } from './msToSec.impl.js'
import { serializeOtpToMqtt } from './serializeOtpToMqtt.impl.js'
import { getCommandResponseSubscriptionTopic } from './topic/getCommandResponseSubscriptionTopic.impl.js'
import { getCommandSubscriptionTopic } from './topic/getCommandSubscriptionTopic.impl.js'
import { getSharedTopicName } from './topic/getSharedTopicName.impl.js'
import { getSubscriptionTopic } from './topic/getSubscriptionTopic.impl.js'
import { getTopicName } from './topic/getTopicName.impl.js'
import { TopicRouter } from './topic/TopicRouter.js'
import type { MqttBridgeConfig } from './types/MqttBridgeConfig.js'

/**
 * The MQTT event bridge connects to a MQTT broker.
 * The broker must support the MQTT 5 protocol version
 *
 * @example
 * ```typescript
 * import { MqttBridge } from '@purista/mqttbridge'
 *
 * // create and init our eventbridge
 * const eventBridge = new MqttBridge()
 * await eventBridge.start()
 *
 * @group Event bridge
 */
export class MqttBridge extends EventBridgeBaseClass<MqttBridgeConfig> implements EventBridge {
	public client: MqttClient | undefined
	public pendingInvocations = new PendingInvocationRegistry<unknown>({
		onLateResponse: correlationId => {
			this.logger.warn({ correlationId }, 'Ignoring late command response after invocation timeout')
		},
	})
	private registeredSubscriptionTopics = new Map<string, string>()
	private router = new TopicRouter()

	private getConnectedClient(): MqttClient {
		if (!this.client) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a MQTT server')
		}
		return this.client
	}

	constructor(config?: EventBridgeConfig<Partial<MqttBridgeConfig>>) {
		const conf = {
			...getDefaultMqttBridgeConfig(),
			...config,
			clientId: config?.clientId ?? config?.instanceId ?? getNewInstanceId(),
		}
		super('MqttBridge', conf)
		this.capabilities = {
			supportsStreams: false,
			durableCommands: false,
			durableSubscriptions: false,
			manualAckSupported: false,
			lateResponseHandling: EventBridgeLateResponseHandling.IgnoreWithWarning,
			gracefulDrainSupported: true,
			nativeDeadLettering: false,
			consumerFailureHandling: {
				boundedRetry: false,
				delayedRetry: false,
				deadLetterTarget: false,
				bridgeManagedDeadLettering: false,
				nativeDeadLettering: false,
				fatalClassification: false,
				strictMode: true,
			},
		}
	}

	async start() {
		this.client = await connectAsync(this.config)

		this.client.on('connect', () => {
			this.logger.info('connected to MQTT broker')
		})
		this.client.on('error', (err: Error) => {
			this.logger.error({ err }, 'mqtt client error')
		})
		this.client.on('disconnect', () => {
			this.logger.warn('mqtt client disconnected')
		})
		this.client.on('reconnect', () => {
			this.logger.info('mqtt client reconnecting')
		})

		const topic = getCommandResponseSubscriptionTopic.bind(this)()
		const subscriptionIdentifier = this.router.add(topic, handleCommandResponse)
		await this.client.subscribeAsync(topic, {
			qos: this.config.qosCommand,
			properties: { subscriptionIdentifier },
		})

		this.client.on('message', (topic: string, payload: Buffer, packet: IPublishPacket) => {
			const handler = this.router.match(topic, packet.properties?.subscriptionIdentifier as number | undefined)
			if (!handler.length) {
				const err = new UnhandledError(StatusCode.InternalServerError, 'received message for unknown topic ', {
					topic: packet.topic,
					id: packet.properties?.subscriptionIdentifier,
				})
				this.logger.error({ err }, err.message)
			}

			let content: EBMessage
			try {
				content = JSON.parse(payload.toString())
			} catch (err) {
				this.logger.error({ err }, 'unable to parse received MQTT message')
				return
			}

			for (const fn of handler) {
				fn.bind(this)(content, packet)
			}
		})
	}

	async emitMessage<T extends EBMessage>(
		message: Omit<EBMessage, 'id' | 'timestamp' | 'correlationId'>,
		contentType = 'application/json',
		contentEncoding = 'utf-8',
	): Promise<Readonly<EBMessage>> {
		const client = this.getConnectedClient()
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

			const userProperties: BrokerHeaderCustomMsg = serializeOtpToMqtt({
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

			const topic = getTopicName.bind(this)(msg)
			await client.publishAsync(topic, JSON.stringify(msg), {
				qos: this.config.qoSSubscription,
				properties: {
					contentType: 'application/json',
					userProperties,
					messageExpiryInterval: this.config.defaultMessageExpiryInterval,
				},
			})

			return msg as Readonly<T>
		})
	}

	async isReady() {
		return !!this.client?.connected
	}

	async isHealthy() {
		return !!this.client?.connected
	}

	async invoke<T>(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		commandTimeout: number = this.defaultCommandTimeout,
	): Promise<T> {
		const client = this.getConnectedClient()
		const context = deserializeOtp(this.logger, input.otp)
		return this.startActiveSpan(
			PuristaSpanName.EventBridgeInvokeCommand,
			{ kind: SpanKind.PRODUCER },
			context,
			async span => {
				const correlationId = getNewCorrelationId()

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

				const executionPromise = this.pendingInvocations.register(
					command.correlationId,
					commandTimeout,
					command.traceId,
				) as Promise<T>

				span.setAttribute(PuristaSpanTag.SenderServiceName, command.sender.serviceName)
				span.setAttribute(PuristaSpanTag.SenderServiceVersion, command.sender.serviceVersion)
				span.setAttribute(PuristaSpanTag.SenderServiceTarget, command.sender.serviceTarget)
				span.setAttribute(PuristaSpanTag.ReceiverServiceName, command.receiver.serviceName)
				span.setAttribute(PuristaSpanTag.ReceiverServiceVersion, command.receiver.serviceVersion)
				span.setAttribute(PuristaSpanTag.ReceiverServiceTarget, command.receiver.serviceTarget)

				const userProperties: BrokerHeaderCommandMsg = serializeOtpToMqtt({
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

				const topic = getTopicName.bind(this)(command)

				await client.publishAsync(topic, JSON.stringify(command), {
					// if event name is set use the largest QOS
					qos: command.eventName
						? this.config.qoSSubscription > this.config.qosCommand
							? this.config.qoSSubscription
							: this.config.qosCommand
						: this.config.qosCommand,
					properties: {
						messageExpiryInterval: command.eventName
							? this.config.defaultMessageExpiryInterval
							: msToSec(commandTimeout),
						contentType: 'application/json',
						userProperties,
						correlationData: Buffer.from(command.correlationId),
					},
				})

				return executionPromise
			},
		)
	}

	async registerCommand(
		address: EBMessageAddress,
		cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
		metadata: CommandDefinitionMetadataBase,
		eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string> {
		const client = this.getConnectedClient()
		const topic = getSharedTopicName.bind(this)(getCommandSubscriptionTopic.bind(this)(address))
		const subscriptionIdentifier = this.router.add(topic, getCommandHandler(address, cb, metadata, eventBridgeConfig))
		await client.subscribeAsync(topic, {
			qos: this.config.qosCommand,
			properties: { subscriptionIdentifier },
		})

		const info = createInfoMessage(
			EBMessageType.InfoServiceFunctionAdded,
			{ ...address, instanceId: this.instanceId },
			{ payload: metadata },
		)
		await this.emitMessage(info)

		return topic
	}

	async unregisterCommand(address: EBMessageAddress): Promise<void> {
		const client = this.getConnectedClient()
		const topic = getSharedTopicName.bind(this)(getCommandSubscriptionTopic.bind(this)(address))
		await client.unsubscribeAsync(topic)
		this.router.remove(topic)
	}

	async registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string> {
		const client = this.getConnectedClient()
		const opts: IClientSubscribeOptions = { qos: this.config.qoSSubscription, properties: {} }

		let topic = getSubscriptionTopic.bind(this)(subscription)

		const shared = subscription.eventBridgeConfig.shared

		if (shared) {
			topic = getSharedTopicName.bind(this)(topic)
		}

		const subscriptionIdentifier = this.router.add(topic, getSubscriptionHandler(subscription, cb))

		opts.properties = {
			...opts.properties,
			subscriptionIdentifier,
		}

		await client.subscribeAsync(topic, opts)
		this.registeredSubscriptionTopics.set(
			`${subscription.subscriber.serviceName}-${subscription.subscriber.serviceVersion},${subscription.subscriber.serviceTarget}`,
			topic,
		)

		return topic
	}

	async unregisterSubscription(address: EBMessageAddress): Promise<void> {
		const client = this.getConnectedClient()
		const key = `${address.serviceName}-${address.serviceVersion},${address.serviceTarget}`
		const topic = this.registeredSubscriptionTopics.get(key)
		if (!topic) {
			return
		}

		await client.unsubscribeAsync(topic)
		this.router.remove(topic)
		this.registeredSubscriptionTopics.delete(key)
	}

	async destroy() {
		this.pendingInvocations.rejectAll(new UnhandledError(StatusCode.ServiceUnavailable, 'mqtt bridge closed'))
		const drained = await this.waitForInFlightDrain()
		if (!drained) {
			this.logger.error('Some MQTT command or subscription handlers did not finish before shutdown')
		}
		const client = this.client
		this.client = undefined
		if (!client) {
			return
		}
		await new Promise<void>(resolve => {
			client.end(false, {}, () => resolve())
		})
	}
}
