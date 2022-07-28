import {
  Command,
  CommandErrorResponse,
  CommandSuccessResponse,
  EBMessage,
  EBMessageAddress,
  EBMessageId,
  EBMessageType,
  EventBridge,
  getCleanedMessage,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
  getTimeoutPromise,
  HandledError,
  InfoInvokeTimeoutPayload,
  InfoMessage,
  isCommandErrorResponse,
  isCommandResponse,
  isCommandSuccessResponse,
  isInfoMessage,
  Logger,
  PendigInvocation,
  StatusCode,
  Subscription,
  UnhandledError,
} from '@purista/core'
import type { Channel, Connection } from 'amqplib'
import amqplib from 'amqplib'

import { getCommandQueueName } from './getCommandQueueName.impl'
import { getDefaultConfig } from './getDefaultConfig.impl'
import { getSubscriptionQueueName } from './getSubscriptionQueueName.impl'
import { jsonEncoder, plainEncrypter } from './payloadHandling'
import { Encoder, Encrypter, RabbitMQEventBridgeConfig } from './types'

/**
 * A adapter to use rabbitMQ as event bridge.
 */
export class RabbitMQEventBridge extends EventBridge {
  protected log: Logger
  protected config: RabbitMQEventBridgeConfig
  protected connection?: Connection
  protected channel?: Channel

  protected replyQueueName?: string
  protected serviceFunctions = new Map<
    string,
    {
      cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>
      channel: Channel
    }
  >()

  protected pendingInvocations = new Map<EBMessageId, PendigInvocation>()

  protected subscriptions = new Map<
    string,
    {
      cb: (message: Command) => Promise<void>
      channel: Channel
    }
  >()

  protected encoder: Encoder = {
    ...jsonEncoder,
  }

  protected encrypter: Encrypter = {
    ...plainEncrypter,
  }

  constructor(baseLogger: Logger, conf: RabbitMQEventBridgeConfig = getDefaultConfig()) {
    super()
    this.config = {
      ...getDefaultConfig(),
      ...conf,
    }

    this.encoder = {
      ...this.encoder,
      ...conf.encoder,
    }

    this.encrypter = {
      ...this.encrypter,
      ...conf.encrypter,
    }
    this.log = baseLogger.getChildLogger({ name: 'amqpEventBridge' })
  }

  /**
   * Get default time out.
   * It is the maximum time a command should be responded.
   */
  get defaultCommandTimeout() {
    return this.config.defaultCommandTimeout
  }

  /**
   * Get instance id.
   * The id of current event bridge instance.
   */
  get instanceId() {
    return this.config.instanceId
  }

  /**
   * Connect to RabbitMQ broker, ensure exchange, call back queue
   */
  async start() {
    try {
      this.connection = await amqplib.connect(this.config.url, this.config.socketOptions)
    } catch (error) {
      this.emit('eventbridge-connection-error', error)
      this.log.error('unable to connect to broker', error)
      throw error
    }

    this.connection.on('error', (e) => {
      this.log.error('amqp lib error', e)
      this.emit('eventbridge-error', e)
    })
    this.connection.on('close', (e) => this.emit('eventbridge-disconnected', e))
    this.emit('eventbridge-connected', undefined)
    this.log.info('connected to broker')
    this.channel = await this.connection.createChannel()
    this.log.debug('ensured: default exchange')
    await this.channel.assertExchange(this.config.exchangeName, 'headers', this.config.exchangeOptions)
    const responseQueue = await this.channel.assertQueue('', { exclusive: true, autoDelete: true, durable: false })
    this.replyQueueName = responseQueue.queue
    await this.channel.bindQueue(this.replyQueueName, this.config.exchangeName, '', {
      'x-match': 'all',
      replyTo: this.replyQueueName,
    })
    this.channel.consume(
      this.replyQueueName,
      async (msg) => {
        if (!msg) {
          return
        }

        try {
          const message = await this.decodeContent<EBMessage>(
            msg.content,
            msg.properties.contentType,
            msg.properties.contentEncoding,
          )

          const log = this.log.getChildLogger({ traceId: message.traceId })

          if (isCommandResponse(message)) {
            const mapEntry = this.pendingInvocations.get(message.correlationId)
            if (!mapEntry) {
              const error = new UnhandledError(
                StatusCode.BadRequest,
                'InvalidCommandResponse: received invalid command response',
                getCleanedMessage(message),
              )
              this.log.error('received invalid command response', error)
              this.emit('eventbridge-error', error)
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
          this.log.error('received invalid message', err)
          this.emit('eventbridge-error', err)
        } catch (error) {
          const err = new HandledError(StatusCode.InternalServerError, 'failed to handle response message', error)
          this.emit('eventbridge-error', err)
          this.log.error('failed to handle response message', err)
        }
      },
      { noAck: true },
    )
    this.log.debug('ensured: response queue')

    this.log.info('amqp event bridge ready')
  }

  async emitMessage<T extends EBMessage>(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
    contentType = 'application/json',
    contentEncoding = 'utf-8',
  ): Promise<Readonly<EBMessage>> {
    if (!this.channel) {
      throw new Error('No channel - not connected')
    }

    const msg = Object.freeze({
      id: getNewEBMessageId(),
      timestamp: Date.now(),
      traceId: message.traceId || getNewTraceId(),
      instanceId: this.config.instanceId,
      ...message,
    })

    const headers: Record<string, string | undefined> = {
      messageType: msg.messageType,
      senderServiceName: msg.sender.serviceName,
      senderServiceVersion: msg.sender.serviceVersion,
      senderServiceTarget: msg.sender.serviceTarget,
      instanceId: msg.instanceId,
      eventName: msg.eventName,
      principalId: msg.principalId,
    }

    const payload = await this.encodeContent(msg, contentType, contentEncoding)

    await this.channel.publish(this.config.exchangeName, '', payload, {
      messageId: msg.id,
      timestamp: msg.timestamp,
      contentType,
      contentEncoding,
      type: msg.messageType,
      headers,
    })

    return msg as Readonly<T>
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    contentType = 'application/json',
    contentEncoding = 'utf-8',
    commandTimeout: number = this.config.defaultCommandTimeout,
  ): Promise<T> {
    if (!this.channel) {
      throw new Error('No channel - not connected')
    }

    const correlationId = getNewCorrelationId()

    const command = Object.freeze({
      id: getNewEBMessageId(),
      instanceId: this.instanceId,
      correlationId: getNewCorrelationId(),
      timestamp: Date.now(),
      messageType: EBMessageType.Command,
      traceId: input.traceId || getNewTraceId(),
      ...input,
    })

    const removeFromPending = () => {
      this.pendingInvocations.delete(correlationId)
    }

    const sendErrorInfoMsg = async () => {
      try {
        const payload: InfoInvokeTimeoutPayload = {
          traceId: command.traceId,
          correlationId,
          sender: command.sender,
          receiver: command.receiver,
          timestamp: command.timestamp,
        }

        const infoMessage: InfoMessage = {
          id: getNewEBMessageId(),
          instanceId: command.instanceId,
          principalId: command.principalId,
          traceId: command.traceId,
          correlationId: command.correlationId,
          timestamp: Date.now(),
          messageType: EBMessageType.InfoInvokeTimeout,
          payload,
          sender: input.sender,
        }

        await this.emitMessage(infoMessage)
      } catch (err) {
        const error = new UnhandledError(StatusCode.BadGateway, 'failed to send InfoInvokeTimeout message', {
          traceId: command.traceId,
          correlationId,
          error: err,
        })
        this.log.getChildLogger({ traceId: command.traceId }).error(`failed to send InfoInvokeTimeout message`, error)
        this.emit('eventbridge-error', error)
      }
    }

    const executionPromise = new Promise<T>((resolve, reject) => {
      this.pendingInvocations.set(command.correlationId, {
        resolve: (successPayload: T) => {
          removeFromPending()
          resolve(successPayload)
        },
        reject: (err: unknown) => {
          removeFromPending()
          reject(err)
          sendErrorInfoMsg()
        },
      })
    })

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

    const content = await this.encodeContent(command, contentType, contentEncoding)

    this.channel.publish(this.config.exchangeName, '', content, {
      messageId: command.id,
      timestamp: command.timestamp,
      correlationId: command.correlationId,
      contentType,
      contentEncoding,
      type: command.messageType,
      headers,
      replyTo: this.replyQueueName,
    })

    return Promise.race([executionPromise, getTimeoutPromise(commandTimeout, command.traceId)])
  }

  /**
   * Register a service function and ensure that there is a queue for all incoming command requests.
   * @param address The service function address
   * @param cb the function to call if a matching command message arrives
   * @returns the id of command function queue
   */
  async registerServiceFunction(
    address: EBMessageAddress,
    cb: (message: Command) => Promise<CommandSuccessResponse | CommandErrorResponse>,
  ): Promise<string> {
    if (!this.connection) {
      throw new Error('No connection - not connected')
    }

    const queueName = getCommandQueueName(address, this.config.namePrefix)

    const channel = await this.connection.createChannel()
    const queue = await channel.assertQueue(queueName, { durable: false, autoDelete: true })
    await channel.bindQueue(queue.queue, this.config.exchangeName, '', {
      'x-match': 'all',
      messageType: EBMessageType.Command,
      receiverServiceName: address.serviceName,
      receiverServiceVersion: address.serviceVersion,
      receiverServiceTarget: address.serviceTarget,
    })

    channel.consume(
      queue.queue,
      async (msg) => {
        if (!msg) {
          return
        }
        try {
          const command = await this.decodeContent<Command>(
            msg.content,
            msg.properties.contentType,
            msg.properties.contentEncoding,
          )

          const result = await cb(command)

          const responseMessage = {
            ...result,
            instanceId: this.instanceId,
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

          const contentType = 'application/json'
          const contentEncoding = 'utf-8'

          const payload = await this.encodeContent(responseMessage, contentType, contentEncoding)

          this.channel?.publish(this.config.exchangeName, '', payload, {
            messageId: responseMessage.id,
            timestamp: responseMessage.timestamp,
            correlationId: msg.properties.correlationId,
            contentType,
            contentEncoding,
            type: responseMessage.messageType,
            headers,
          })
        } catch (error) {
          const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to consume command response message', {
            error,
          })
          this.emit('eventbridge-error', err)
          this.log.error('Failed to consume command response message', err)
        }
      },
      { noAck: true },
    )

    this.serviceFunctions.set(queueName, { cb, channel })

    return queueName
  }

  async unregisterServiceFunction(address: EBMessageAddress): Promise<void> {
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
      this.log.error('Failed to unregister service function', err)
    }
  }

  async registerSubscription(subscription: Subscription, cb: (message: EBMessage) => Promise<void>): Promise<string> {
    if (!this.connection) {
      throw new Error('No connection - not connected')
    }

    const queueName = getSubscriptionQueueName(subscription.subscriber, this.config.namePrefix)

    const channel = await this.connection.createChannel()
    const queue = await channel.assertQueue(queueName, { durable: subscription.settings.durable })
    await channel.bindQueue(queue.queue, this.config.exchangeName, '', {
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

    channel.consume(
      queue.queue,
      async (msg) => {
        if (!msg) {
          return
        }
        try {
          const message = await this.decodeContent<EBMessage>(
            msg.content,
            msg.properties.contentType,
            msg.properties.contentEncoding,
          )

          await cb(message)
          channel.ack(msg)
        } catch (error) {
          const err = new UnhandledError(StatusCode.InternalServerError, 'Failed to consume subscription message', {
            error,
            subscription,
          })
          this.emit('eventbridge-error', err)
          this.log.error('Failed to consume subscription message', err)
        }
      },
      { noAck: false },
    )

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
      this.log.error('Failed to unregister subscription', err)
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
   * @param input
   * @param contentType
   * @param contentEncoding
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
}
