import { SpanKind } from '@opentelemetry/api'
import {
  Command,
  CommandDefinitionMetadataBase,
  CommandErrorResponse,
  CommandSuccessResponse,
  createInfoMessage,
  CustomMessage,
  DefinitionEventBridgeConfig,
  deserializeOtp,
  EBMessage,
  EBMessageAddress,
  EBMessageId,
  EBMessageType,
  EventBridge,
  EventBridgeBaseClass,
  EventBridgeConfig,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewInstanceId,
  getNewTraceId,
  isCommandResponse,
  PendigInvocation,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  Subscription,
  UnhandledError,
} from '@purista/core'
import { IClientSubscribeOptions, IPublishPacket } from 'mqtt'

import { AsyncClient } from './AsyncClient'
import { getDefaultMqttBridgeConfig } from './getDefaultMqttBridgeConfig.impl'
import { getCommandHandler, getSubscriptionHandler, handleCommandResponse } from './handler'
import { msToSec } from './msToSec.impl'
import { serializeOtpToMqtt } from './serializeOtpToMqtt.impl'
import {
  getCommandResponseTopic,
  getCommandSubscriptionTopic,
  getSharedTopicName,
  getSubscriptionTopic,
  getTopicName,
  TopicRouter,
} from './topic'
import { MqttBridgeConfig } from './types'

export class MqttBridge extends EventBridgeBaseClass<MqttBridgeConfig> implements EventBridge {
  private healthy = false
  private ready = false
  public client: AsyncClient
  public pendingInvocations = new Map<EBMessageId, PendigInvocation>()
  private router = new TopicRouter()

  constructor(config?: EventBridgeConfig<Partial<MqttBridgeConfig>>) {
    const conf = {
      ...getDefaultMqttBridgeConfig(),
      ...config,
      clientId: config?.clientId || config?.instanceId || getNewInstanceId(),
    }
    super('MqttBridge', conf)
    this.client = new AsyncClient(this.logger)
  }

  async start() {
    await this.client.connect(
      { ...this.config, properties: { sessionExpiryInterval: this.config.defaultSessionExpiryInterval } },
      this.config.allowRetries,
    )

    const topic = getCommandResponseTopic.bind(this)()
    const subscriptionIdentifier = this.router.add(topic, handleCommandResponse)
    await this.client.subscribe(topic, {
      qos: this.config.qosCommand,
      properties: { subscriptionIdentifier },
    })

    this.client.on('message', (topic: string, payload: Buffer, packet: IPublishPacket) => {
      const handler = this.router.match(topic, packet.properties?.subscriptionIdentifier)
      let content: EBMessage
      try {
        content = JSON.parse(payload.toString())
      } catch (err) {
        this.logger.error({ err }, 'unable to parse received MQTT message')
        return
      }

      handler.forEach((fn) => fn.bind(this)(content, packet))
      if (!handler.length) {
        const err = new UnhandledError(StatusCode.InternalServerError, 'received message for unknown topic ', {
          topic: packet.topic,
          id: packet.properties?.subscriptionIdentifier,
        })
        this.logger.error({ err }, err.message)
      }
    })
  }

  async emitMessage<T extends EBMessage>(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
    contentType = 'application/json',
    contentEncoding = 'utf-8',
  ): Promise<Readonly<EBMessage>> {
    const context = deserializeOtp(this.logger, message.otp)

    const name = isCommandResponse(message as EBMessage)
      ? PuristaSpanName.EventBridgeCommandResponseSent
      : PuristaSpanName.EventBridgeEmitMessage

    return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async (span) => {
      const msg = Object.freeze({
        ...message,
        id: getNewEBMessageId(),
        timestamp: Date.now(),
        traceId: message.traceId || span.spanContext().traceId,
        instanceId: this.instanceId,
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

      const userProperties: Record<string, string> = serializeOtpToMqtt({
        messageType: msg.messageType,
        senderServiceName: msg.sender.serviceName,
        senderServiceVersion: msg.sender.serviceVersion,
        senderServiceTarget: msg.sender.serviceTarget,
        instanceId: msg.instanceId,
      })

      if (msg.eventName) {
        userProperties.eventName = msg.eventName
      }

      if (msg.principalId) {
        userProperties.principalId = msg.principalId
      }

      const topic = getTopicName.bind(this)(msg)
      await this.client.publish(topic, JSON.stringify(msg), {
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
    return this.client.connected
  }

  async isHealthy() {
    return this.client.connected
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    commandTimeout: number = this.defaultCommandTimeout,
  ): Promise<T> {
    const context = deserializeOtp(this.logger, input.otp)
    return this.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, context, async (span) => {
      const correlationId = getNewCorrelationId()

      const command: Command = Object.freeze({
        ...input,
        id: getNewEBMessageId(),
        instanceId: this.instanceId,
        correlationId,
        timestamp: Date.now(),
        messageType: EBMessageType.Command,
        traceId: input.traceId || span.spanContext().traceId || getNewTraceId(),
        otp: serializeOtp(),
      })

      const log = this.logger.getChildLogger({ ...span.spanContext(), traceId: command.traceId })

      const removeFromPending = () => {
        this.pendingInvocations.delete(correlationId)
      }

      const executionPromise = new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(() => {
          const err = new UnhandledError(StatusCode.GatewayTimeout, 'invocation timed out', undefined, command.traceId)
          log.warn({ err })
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

      span.setAttribute(PuristaSpanTag.SenderServiceName, command.sender.serviceName)
      span.setAttribute(PuristaSpanTag.SenderServiceVersion, command.sender.serviceVersion)
      span.setAttribute(PuristaSpanTag.SenderServiceTarget, command.sender.serviceTarget)
      span.setAttribute(PuristaSpanTag.ReceiverServiceName, command.receiver.serviceName)
      span.setAttribute(PuristaSpanTag.ReceiverServiceVersion, command.receiver.serviceVersion)
      span.setAttribute(PuristaSpanTag.ReceiverServiceTarget, command.receiver.serviceTarget)

      const userProperties: Record<string, string> = serializeOtpToMqtt({
        messageType: command.messageType,
        senderServiceName: command.sender.serviceName,
        senderServiceVersion: command.sender.serviceVersion,
        senderServiceTarget: command.sender.serviceTarget,
        receiverServiceName: command.receiver.serviceName,
        receiverServiceVersion: command.receiver.serviceVersion,
        receiverServiceTarget: command.receiver.serviceTarget,
        instanceId: command.instanceId,
      })

      if (command.eventName) {
        userProperties.eventName = command.eventName
      }

      if (command.principalId) {
        userProperties.principalId = command.principalId
      }

      const topic = getTopicName.bind(this)(command)
      const responseTopic = getCommandResponseTopic.bind(this)()

      await this.client.publish(topic, JSON.stringify(command), {
        qos: this.config.qosCommand,
        properties: {
          messageExpiryInterval: msToSec(commandTimeout),
          contentType: 'application/json',
          userProperties,
          correlationData: Buffer.from(command.correlationId),
          responseTopic,
        },
      })

      return executionPromise
    })
  }

  async registerCommand(
    address: EBMessageAddress,
    cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
    metadata: CommandDefinitionMetadataBase,
    eventBridgeConfig: DefinitionEventBridgeConfig,
  ): Promise<string> {
    const topic = getSharedTopicName.bind(this)(getCommandSubscriptionTopic.bind(this)(address))
    const subscriptionIdentifier = this.router.add(topic, getCommandHandler(address, cb, metadata, eventBridgeConfig))

    await this.client.subscribe(topic, {
      qos: this.config.qosCommand,
      properties: { subscriptionIdentifier },
    })

    const info = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, address, { payload: metadata })
    await this.emitMessage(info)

    return topic
  }

  async unregisterCommand(address: EBMessageAddress): Promise<void> {
    const topic = getSharedTopicName.bind(this)(getCommandSubscriptionTopic.bind(this)(address))
    await this.client.unsubscribe(topic)
    this.router.remove(topic)
  }

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
  ): Promise<string> {
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

    await this.client.subscribe(topic, opts)

    return topic
  }

  async unregisterSubscription(_address: EBMessageAddress): Promise<void> {}

  async destroy() {
    this.client.end(true)
  }
}
