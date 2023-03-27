import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api'
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
  getCleanedMessage,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
  HandledError,
  isCommandErrorResponse,
  isCommandResponse,
  isCommandSuccessResponse,
  isInfoMessage,
  PendigInvocation,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  Subscription,
  UnhandledError,
} from '@purista/core'
import type { Channel, Connection } from 'amqplib'
import amqplib from 'amqplib'

import { deserializeOtpFromAmqpHeader } from './deserializeOtpFromAmqpHeader.impl'
import { getCommandQueueName } from './getCommandQueueName.impl'
import { getDefaultConfig } from './getDefaultConfig.impl'
import { getSubscriptionQueueName } from './getSubscriptionQueueName.impl'
import { jsonEncoder, plainEncrypter } from './payloadHandling'
import { serializeOtpForAmqpHeader } from './serializeOtpForAmqpHeader.impl'
import { AmqpBridgeConfig, Encoder, Encrypter } from './types'
/**
 * A adapter to use rabbitMQ as event bridge.
 */
export class AmqpBridge extends EventBridgeBaseClass<AmqpBridgeConfig> implements EventBridge {
  protected connection?: Connection
  protected channel?: Channel

  protected healthy = false
  protected ready = false

  protected consumerTags: string[] = []

  protected replyQueueName?: string
  protected serviceFunctions = new Map<
    string,
    {
      cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>
      channel: Channel
    }
  >()

  protected pendingInvocations = new Map<EBMessageId, PendigInvocation>()

  protected runningSubscriptionCount = 0

  protected subscriptions = new Map<
    string,
    {
      cb: (message: CustomMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>
      channel: Channel
    }
  >()

  protected encoder: Encoder = {
    ...jsonEncoder,
  }

  protected encrypter: Encrypter = {
    ...plainEncrypter,
  }

  constructor(config: EventBridgeConfig<AmqpBridgeConfig>) {
    //= getDefaultConfig()
    const conf = {
      ...config,
      config: { ...getDefaultConfig(), ...config },
    }
    super('AmqpBridge', conf)

    this.encoder = {
      ...this.encoder,
      ...this.config.config?.encoder,
    }

    this.encrypter = {
      ...this.encrypter,
      ...this.config.config?.encrypter,
    }
  }

  async isReady() {
    return this.ready
  }

  async isHealthy() {
    return this.healthy
  }

  /**
   * Connect to RabbitMQ broker, ensure exchange, call back queue
   */
  async start() {
    await super.start()
    try {
      this.connection = await amqplib.connect(
        this.config.config?.url || getDefaultConfig().url,
        this.config.config?.socketOptions,
      )
    } catch (err) {
      this.emit('eventbridge-connection-error', err)
      this.logger.fatal({ err }, 'unable to connect to broker')
      throw err
    }

    this.connection.on('error', (err) => {
      this.healthy = false
      this.logger.error({ err }, 'amqp lib error')
      this.emit('eventbridge-error', err)
    })
    this.connection.on('close', () => {
      this.healthy = false
      this.ready = false
      this.emit('eventbridge-disconnected')
      this.logger.info('amqp connection disconnected')
    })

    this.emit('eventbridge-connected')
    this.logger.info('connected to broker')
    this.channel = await this.connection.createChannel()

    this.channel.on('close', () => {
      this.healthy = false
      this.ready = false
      this.logger.info('channel closed')
      this.emit('eventbridge-disconnected')
    })

    this.channel.on('error', (err) => {
      this.healthy = false
      this.logger.error({ err }, 'amqp channel error')
      this.emit('eventbridge-error', err)
    })

    this.logger.debug('ensured: default exchange')
    await this.channel.assertExchange(
      this.config.config?.exchangeName || getDefaultConfig().exchangeName,
      'headers',
      this.config.config?.exchangeOptions,
    )
    const responseQueue = await this.channel.assertQueue('', { exclusive: true, autoDelete: true, durable: false })
    this.replyQueueName = responseQueue.queue
    await this.channel.bindQueue(
      this.replyQueueName,
      this.config.config?.exchangeName || getDefaultConfig().exchangeName,
      '',
      {
        'x-match': 'all',
        replyTo: this.replyQueueName,
      },
    )
    const consume = await this.channel.consume(
      this.replyQueueName,
      async (msg) => {
        if (!msg) {
          return
        }
        const context = await deserializeOtpFromAmqpHeader(this.logger, msg, this.encrypter, this.encoder)
        return this.startActiveSpan(
          PuristaSpanName.EventBridgeCommandResponseReceived,
          { kind: SpanKind.CONSUMER },
          context,
          async (span) => {
            try {
              const message = await this.decodeContent<EBMessage>(
                msg.content,
                msg.properties.contentType,
                msg.properties.contentEncoding,
              )

              if (message.eventName) {
                span.addEvent(message.eventName)
              }

              const log = this.logger.getChildLogger({ traceId: message.traceId })

              if (isCommandResponse(message)) {
                const mapEntry = this.pendingInvocations.get(message.correlationId)
                if (!mapEntry) {
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
                  this.logger.error({ err, ...span.spanContext() }, 'received invalid command response')
                  this.emit('eventbridge-error', err)
                  return
                }
                if (isCommandSuccessResponse(message)) {
                  mapEntry.resolve(message.payload)
                } else if (isCommandErrorResponse(message)) {
                  const error = message.isHandledError
                    ? HandledError.fromMessage(message)
                    : UnhandledError.fromMessage(message)
                  mapEntry.reject(error)
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
              this.logger.error({ err }, 'received invalid message')
              this.emit('eventbridge-error', err)
            } catch (error) {
              const err = new HandledError(StatusCode.InternalServerError, 'failed to handle response message', error)
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: err.message,
              })
              span.recordException(err)
              this.emit('eventbridge-error', err)
              this.logger.error({ err }, 'failed to handle response message')
            }
          },
        )
      },
      { noAck: true },
    )

    this.consumerTags.push(consume.consumerTag)

    this.healthy = true
    this.ready = true
    this.logger.debug('ensured: response queue')

    this.logger.info('amqp event bridge ready')
  }

  async emitMessage<T extends EBMessage>(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
    contentType = 'application/json',
    contentEncoding = 'utf-8',
  ): Promise<Readonly<EBMessage>> {
    const context = await deserializeOtp(this.logger, message.otp)

    const name = isCommandResponse(message as EBMessage)
      ? PuristaSpanName.EventBridgeCommandResponseSent
      : PuristaSpanName.EventBridgeEmitMessage

    return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async (span) => {
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
        traceId: message.traceId || span.spanContext().traceId,
        instanceId: this.instanceId,
        otp: serializeOtp(),
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
        instanceId: msg.instanceId,
        eventName: msg.eventName,
        principalId: msg.principalId,
      }

      serializeOtpForAmqpHeader(headers)

      const payload = await this.encodeContent(msg, contentType, contentEncoding)

      await this.channel.publish(this.config.config?.exchangeName || getDefaultConfig().exchangeName, '', payload, {
        messageId: msg.id,
        timestamp: msg.timestamp,
        contentType,
        contentEncoding,
        type: msg.messageType,
        headers,
      })

      return msg as Readonly<T>
    })
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    commandTimeout: number = this.defaultCommandTimeout,
  ): Promise<T> {
    const context = await deserializeOtp(this.logger, input.otp)
    return this.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, context, async (span) => {
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
        id: getNewEBMessageId(),
        instanceId: this.instanceId,
        correlationId: getNewCorrelationId(),
        timestamp: Date.now(),
        messageType: EBMessageType.Command,
        traceId: input.traceId || span.spanContext().traceId || getNewTraceId(),
        otp: serializeOtp(),
        ...input,
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
        receiverServiceName: command.receiver.serviceName,
        receiverServiceVersion: command.receiver.serviceVersion,
        receiverServiceTarget: command.receiver.serviceTarget,
        instanceId: command.instanceId,
        eventName: command.eventName,
        principalId: command.principalId,
      }
      serializeOtpForAmqpHeader(headers)

      const content = await this.encodeContent(command, 'application/json', 'utf-8')

      this.channel.publish(this.config.config?.exchangeName || getDefaultConfig().exchangeName, '', content, {
        messageId: command.id,
        timestamp: command.timestamp,
        correlationId: command.correlationId,
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        type: command.messageType,
        headers,
        replyTo: this.replyQueueName,
      })

      return executionPromise
    })
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
      throw new Error('No connection - not connected')
    }

    const queueName = getCommandQueueName(address, this.config.config?.namePrefix)

    const channel = await this.connection.createChannel()

    const noAck = !eventBridgeConfig.autoacknowledge

    channel.on('close', () => {
      this.healthy = false
      this.logger.info({ queueName }, 'channel for command closed')
      this.emit('eventbridge-disconnected')
    })

    channel.on('error', (err) => {
      this.healthy = false
      this.logger.error({ err, queueName }, 'command channel error')
      this.emit('eventbridge-error', err)
    })

    const queue = await channel.assertQueue(queueName, { durable: !!eventBridgeConfig.durable, autoDelete: true })
    await channel.bindQueue(queue.queue, this.config.config?.exchangeName || getDefaultConfig().exchangeName, '', {
      'x-match': 'all',
      messageType: EBMessageType.Command,
      receiverServiceName: address.serviceName,
      receiverServiceVersion: address.serviceVersion,
      receiverServiceTarget: address.serviceTarget,
    })

    const consume = await channel.consume(
      queue.queue,
      async (msg) => {
        const context = await deserializeOtpFromAmqpHeader(this.logger, msg, this.encrypter, this.encoder)
        return this.startActiveSpan(
          PuristaSpanName.EventBridgeCommandReceived,
          { kind: SpanKind.CONSUMER },
          context,
          async (span) => {
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

              const returnContext = await deserializeOtp(this.logger, result.otp)
              return this.startActiveSpan(
                PuristaSpanName.EventBridgeCommandResponseSent,
                { kind: SpanKind.CONSUMER },
                returnContext,
                async (subSpan) => {
                  const responseMessage = {
                    ...result,
                    instanceId: this.instanceId,
                    otp: serializeOtp(),
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
                    receiverServiceName: responseMessage.receiver.serviceName,
                    receiverServiceVersion: responseMessage.receiver.serviceVersion,
                    receiverServiceTarget: responseMessage.receiver.serviceTarget,
                    instanceId: responseMessage.instanceId,
                    replyTo: msg.properties.replyTo,
                    eventName: responseMessage.eventName,
                    principalId: responseMessage.principalId,
                  }

                  serializeOtpForAmqpHeader(headers)

                  const contentType = 'application/json'
                  const contentEncoding = 'utf-8'

                  const payload = await this.encodeContent(responseMessage, contentType, contentEncoding)

                  this.channel?.publish(
                    this.config.config?.exchangeName || getDefaultConfig().exchangeName,
                    '',
                    payload,
                    {
                      messageId: responseMessage.id,
                      timestamp: responseMessage.timestamp,
                      correlationId: msg.properties.correlationId,
                      contentType,
                      contentEncoding,
                      type: responseMessage.messageType,
                      headers,
                    },
                  )

                  if (noAck) {
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
              this.emit('eventbridge-error', err)
              this.logger.error({ err }, 'Failed to consume command response message')
              if (noAck) {
                channel.nack(msg)
              }
            }
          },
        )
      },
      { noAck },
    )

    this.consumerTags.push(consume.consumerTag)

    this.serviceFunctions.set(queueName, { cb, channel })

    const info = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, address, { payload: metadata })
    await this.emitMessage(info)

    return queueName
  }

  async unregisterCommand(address: EBMessageAddress): Promise<void> {
    try {
      const queueName = getCommandQueueName(address)
      const entry = this.serviceFunctions.get(queueName)
      if (!entry) {
        return
      }
      await entry.channel.close()
      this.serviceFunctions.delete(queueName)
    } catch (error) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to unregister service function', {
        error,
        address,
      })
      this.emit('eventbridge-error', err)
      this.logger.error({ err }, 'Failed to unregister service function')
    }
  }

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
  ): Promise<string> {
    if (!this.connection) {
      throw new Error('No connection - not connected')
    }

    const noAck = !subscription.eventBridgeConfig.autoacknowledge

    const isShared = subscription.eventBridgeConfig.shared === undefined || subscription.eventBridgeConfig.shared

    const queueName = isShared ? getSubscriptionQueueName(subscription.subscriber, this.config.config?.namePrefix) : ''

    const queOptions: amqplib.Options.AssertQueue = isShared
      ? {
          durable: subscription.eventBridgeConfig.durable,
        }
      : { exclusive: true, autoDelete: true, durable: false }

    const channel = await this.connection.createChannel()

    channel.on('close', () => {
      this.healthy = false
      this.logger.info({ queueName }, 'channel for subscription closed')
      this.emit('eventbridge-disconnected')
    })

    channel.on('error', (err) => {
      this.healthy = false
      this.logger.error({ err, queueName }, 'subscription channel error')
      this.emit('eventbridge-error', err)
    })

    const queue = await channel.assertQueue(queueName, queOptions)
    await channel.bindQueue(queue.queue, this.config.config?.exchangeName || getDefaultConfig().exchangeName, '', {
      'x-match': 'all',
      messageType: subscription.messageType,
      senderServiceName: subscription.sender?.serviceName,
      senderServiceVersion: subscription.sender?.serviceVersion,
      senderServiceTarget: subscription.sender?.serviceTarget,
      receiverServiceName: subscription.receiver?.serviceName,
      receiverServiceVersion: subscription.receiver?.serviceVersion,
      receiverServiceTarget: subscription.receiver?.serviceTarget,
      eventName: subscription.eventName,
      principalId: subscription.principalId,
      instanceId: subscription.instanceId,
    })

    const consume = await channel.consume(
      queue.queue,
      async (msg) => {
        const context = await deserializeOtpFromAmqpHeader(this.logger, msg, this.encrypter, this.encoder)

        const spanContext = context ? trace.getSpanContext(context) : undefined
        this.startActiveSpan(
          PuristaSpanName.EventBridgeSubscriptionEventReceived,
          { kind: SpanKind.CONSUMER, links: spanContext ? [{ context: spanContext }] : [] },
          context,
          async (span) => {
            if (!msg) {
              return
            }
            this.runningSubscriptionCount++
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
              if (noAck) {
                channel.ack(msg)
              }
              this.runningSubscriptionCount--
            } catch (error) {
              this.runningSubscriptionCount--
              const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to consume subscription message', {
                error,
                subscription,
              })
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: err.message,
              })
              span.recordException(err)
              this.emit('eventbridge-error', err)
              this.logger.error({ err }, 'Failed to consume subscription message')
              if (noAck) {
                channel.nack(msg)
              }
            }
          },
        )
      },
      { noAck },
    )

    this.consumerTags.push(consume.consumerTag)

    this.subscriptions.set(queueName, { cb, channel })
    return queueName
  }

  async unregisterSubscription(address: EBMessageAddress): Promise<void> {
    try {
      const queueName = getSubscriptionQueueName(address)
      const entry = this.subscriptions.get(queueName)
      if (!entry) {
        return
      }
      await entry.channel.close()
      this.subscriptions.delete(queueName)
    } catch (error) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to unregister subscription', {
        error,
        address,
      })
      this.emit('eventbridge-error', err)
      this.logger.error({ err }, 'Failed to unregister subscription')
    }
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

  async destroy() {
    if (this.channel) {
      const channel = this.channel
      // instruct message broker to no longer send messages
      const cancelProms = this.consumerTags.map((tag) => channel.cancel(tag))
      await Promise.all(cancelProms)

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

      await this.channel.close()
    }
    if (this.connection) {
      await this.connection.close()
    }

    await super.destroy()
  }
}
