import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import {
  BrokerHeaderCommandMsg,
  BrokerHeaderCustomMsg,
  Command,
  CommandDefinitionMetadataBase,
  CommandErrorResponse,
  CommandResponse,
  CommandSuccessResponse,
  createInfoMessage,
  CustomMessage,
  DefinitionEventBridgeConfig,
  deserializeOtp,
  EBMessage,
  EBMessageAddress,
  EBMessageType,
  EventBridge,
  EventBridgeBaseClass,
  EventBridgeConfig,
  EventBridgeEventNames,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
  HandledError,
  isCommandResponse,
  isCommandSuccessResponse,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  Subscription,
  UnhandledError,
} from '@purista/core'
import {
  connect,
  headers as getNewHeaders,
  JetStreamManager,
  JSONCodec,
  MsgHdrs,
  NatsConnection,
  Subscription as NatsSubscription,
} from 'nats'

import { deserializeOtpFromNats } from './deserializeOtpFromNats.impl'
import { getDefaultNatsBridgeConfig } from './getDefaultNatsBridgeConfig'
import { getQueueGroupName } from './getQueueGroupName.impl'
import { getCommandHandler, getSubscriptionHandler } from './handler'
import { serializeOtpToNats } from './serializeOtpToNats.impl'
import { getCommandSubscriptionTopic, getSubscriptionTopic, getTopicName } from './topic'
import { NatsBridgeConfig } from './types'

/**
The event bridge supports brokers with and without JetStream enabled.

If JetStream is enabled, subscriptions which are marked as durable are persisted by using JetStream.  
If JetStream is not available, subscription fall back to live-subscriptions without any persistence.  

Example usage:

@example ```typescript
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

  commands = new Map<string, NatsSubscription>()
  subscriptions = new Map<string, NatsSubscription>()

  sc = JSONCodec()

  constructor(config?: EventBridgeConfig<Partial<NatsBridgeConfig>>) {
    const conf = {
      ...getDefaultNatsBridgeConfig(),
      ...config,
    }

    super('NatsBridge', conf)
  }

  async start() {
    const conf = { ...this.config, name: this.instanceId }
    this.connection = await connect(conf)

    this.isJetStreamEnabled = !!this.connection.info?.jetstream

    if (this.isJetStreamEnabled) {
      this.jsm = await this.connection.jetstreamManager()
    }

    this.emit(EventBridgeEventNames.EventbridgeConnected)
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

    return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async (span) => {
      const msg = Object.freeze({
        ...message,
        sender: {
          ...message.sender,
          instanceId: this.instanceId,
        },
        id: getNewEBMessageId(),
        timestamp: Date.now(),
        traceId: message.traceId || span.spanContext().traceId,
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

        Object.entries(userProperties).forEach((value) => headers?.set(value[0], value[1]))
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
      async (span) => {
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
          traceId: input.traceId || span.spanContext().traceId || getNewTraceId(),
          otp: serializeOtp(),
        })

        const log = this.logger.getChildLogger({ ...span.spanContext(), traceId: command.traceId })

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

          Object.entries(userProperties).forEach((value) => headers?.set(value[0], value[1]))
        }

        const topic = getTopicName.bind(this)(command)

        const data = this.sc.encode(command)

        try {
          const msg = await this.connection.request(topic, data, {
            timeout: commandTimeout,
          })

          await new Promise((resolve) =>
            setTimeout(() => {
              resolve(true)
            }, 3000),
          )

          const response: CommandResponse = this.sc.decode(msg.data) as CommandResponse
          const returnContext = deserializeOtpFromNats(this.logger, response, msg.headers)
          return this.startActiveSpan(
            PuristaSpanName.EventBridgeCommandResponseReceived,
            { kind: SpanKind.CONSUMER },
            returnContext,
            async (returnSpan) => {
              const responseLog = this.logger.getChildLogger({ ...span.spanContext(), traceId: response.traceId })

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
                this.emit(EventBridgeEventNames.EventbridgeError, err)
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
    const queue = getQueueGroupName(this.config.topicPrefix, address)
    const subscription = this.connection.subscribe(topic, { callback, queue })

    this.commands.set(`${address.serviceName}-${address.serviceVersion},${address.serviceTarget}`, subscription)

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

    const subscription = this.commands.get(`${address.serviceName}-${address.serviceVersion},${address.serviceTarget}`)

    subscription?.unsubscribe()
    await subscription?.drain()
  }

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
  ): Promise<string> {
    const topic = getSubscriptionTopic.bind(this)(subscription)

    const queueName = getQueueGroupName(this.config.topicPrefix, subscription.subscriber)
    const queue = subscription.eventBridgeConfig.shared ? queueName : undefined
    this.connection?.subscribe(topic, {
      callback: getSubscriptionHandler(subscription, cb).bind(this),
      queue,
    })

    return topic
  }

  async unregisterSubscription(address: EBMessageAddress): Promise<void> {
    if (!this.connection) {
      throw new UnhandledError(StatusCode.ServiceUnavailable, 'not connected to a NATS server')
    }

    const subscription = this.subscriptions.get(
      `${address.serviceName}-${address.serviceVersion},${address.serviceTarget}`,
    )

    subscription?.unsubscribe()
    await subscription?.drain()
  }

  async destroy() {
    await this.connection?.drain()
    await this.connection?.close()
    this.emit(EventBridgeEventNames.EventbridgeDisconnected)
    await super.destroy()
  }
}
