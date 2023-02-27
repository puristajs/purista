import { Stream } from 'node:stream'

import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { puristaVersion } from '../../version'
import { getDefaultEventBridgeConfig } from '../config'
import { HandledError } from '../Error/HandledError.impl'
import { UnhandledError } from '../Error/UnhandledError.impl'
import {
  deserializeOtp,
  getCleanedMessage,
  getCommandQueueName,
  getNewCorrelationId,
  getNewEBMessageId,
  getSubscriptionQueueName,
  getTimeoutPromise,
  serializeOtp,
} from '../helper'
import {
  Command,
  CommandErrorResponse,
  CommandSuccessResponse,
  CustomMessage,
  EBMessage,
  EBMessageAddress,
  EBMessageId,
  EBMessageType,
  EventBridge,
  EventBridgeConfig,
  EventBridgeEnsuredDefaults,
  InfoInvokeTimeoutPayload,
  InfoMessage,
  isCommand,
  isCommandErrorResponse,
  isCommandResponse,
  isCommandSuccessResponse,
  isInfoMessage,
  Logger,
  PuristaSpanName,
  PuristaSpanTag,
  StatusCode,
  Subscription,
} from '../types'
import { EventBridgeBaseClass } from './EventBridgeBaseClass.impl'
import { getNewSubscriptionStorageEntry } from './getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from './isMessageMatchingSubscription.impl'
import { PendigInvocation, SubscriptionStorageEntry } from './types'
/**
 * Simple implementation of some simple in-memory event bridge.
 * Does not support threads and does not need any external databases.
 */
export class DefaultEventBridge extends EventBridgeBaseClass implements EventBridge {
  protected config: EventBridgeEnsuredDefaults
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

  protected subscriptions = new Map<string, SubscriptionStorageEntry>()

  protected hasStarted = false

  constructor(
    conf: EventBridgeConfig = getDefaultEventBridgeConfig(),
    options?: { logger?: Logger; spanProcessor?: SpanProcessor },
  ) {
    super('DefaultEventBridge', options)
    this.config = {
      ...getDefaultEventBridgeConfig(),
      ...conf,
    }
  }

  async isReady() {
    return this.hasStarted
  }

  async start() {
    const write = async (message: EBMessage, _encoding: string, next: (error?: Error) => void) => {
      const context = await deserializeOtp(this.logger, message.otp)

      return this.startActiveSpan(
        PuristaSpanName.EventBridgeHandleIncomingMessage,
        { kind: SpanKind.CONSUMER },
        context,
        async (span) => {
          try {
            this.subscriptions.forEach((subscription) => {
              if (isMessageMatchingSubscription(this.logger, message, subscription)) {
                subscription
                  .cb(message)
                  .then((result) => {
                    if (subscription.emitEventName && result) {
                      this.emitMessage(result)
                    }
                  })
                  .catch((err) => this.logger.error({ err }))
              }
            })

            if (isCommand(message)) {
              const mapEntry = this.serviceFunctions.get(getCommandQueueName(message.receiver))
              if (!mapEntry) {
                const err = new HandledError(
                  StatusCode.BadRequest,
                  'InvalidCommand: received invalid command',
                  getCleanedMessage(message),
                )
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: err.message,
                })
                span.recordException(err)
                this.logger.error({ err, ...span.spanContext() }, 'received invalid command')
                this.emit('eventbridge-error', err)
                return next(err)
              }

              mapEntry(message).then((result) => {
                this.emitMessage(result)
              })
              return next()
            }

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
                return next(err)
              }
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

            const err = new UnhandledError(StatusCode.BadRequest, 'InvalidMessage: received invalid message', message)
            this.logger.error({ err, ...span.spanContext() }, 'received invalid message')
            this.emit('eventbridge-error', err)
            return next()
          } catch (error) {
            const err = new HandledError(StatusCode.InternalServerError, 'eventbus failure', error)
            this.emit('eventbridge-error', err)
            this.logger.error({ err, ...span.spanContext() }, 'eventbus failure')

            span.recordException(err as Error)

            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: (err as Error).message,
            })

            return next(error as Error)
          }
        },
      )
    }

    this.writeStream._write = write.bind(this)

    this.readStream.pipe(this.writeStream)

    this.emit('eventbridge-connected', undefined)

    this.logger.info({ puristaVersion }, 'DefaultEventBridge started')

    this.hasStarted = true
  }

  /**
   * Get default command time out.
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
   * Register a service function and ensure that there is a queue for all incoming command requests.
   * @param address The service function address
   * @param cb the function to call if a matching command message arrives
   * @returns the id of command function queue
   */
  async registerServiceFunction(
    address: EBMessageAddress,
    cb: (message: Command) => Promise<CommandSuccessResponse<unknown> | CommandErrorResponse>,
  ): Promise<string> {
    const queueName = getCommandQueueName(address)
    this.serviceFunctions.set(queueName, cb)
    return queueName
  }

  async unregisterServiceFunction(address: EBMessageAddress): Promise<void> {
    const queueName = getCommandQueueName(address)
    this.serviceFunctions.delete(queueName)
  }

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
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
  async emitMessage(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
  ): Promise<Readonly<EBMessage>> {
    const context = await deserializeOtp(this.logger, message.otp)

    const name = isCommandResponse(message as EBMessage)
      ? PuristaSpanName.EventBridgeCommandResponse
      : PuristaSpanName.EventBridgeEmitMessage

    return this.startActiveSpan(name, { kind: SpanKind.PRODUCER }, context, async (span) => {
      try {
        const msg = Object.freeze({
          ...message,
          id: getNewEBMessageId(),
          timestamp: Date.now(),
          traceId: message.traceId || span.spanContext().traceId,
          instanceId: this.config.instanceId,
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
        this.logger.error({ err, ...span.spanContext() }, 'emitMessage failed')
        throw err
      }
    })
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    _contentType = 'application/json',
    _contentEncoding = 'utf-8',
    commandTimeout = this.config.defaultCommandTimeout,
  ): Promise<T> {
    const context = await deserializeOtp(this.logger, input.otp)

    return this.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, context, async (span) => {
      const correlationId = getNewCorrelationId()

      const command = Object.freeze({
        id: getNewEBMessageId(),
        instanceId: this.instanceId,
        correlationId: getNewCorrelationId(),
        timestamp: Date.now(),
        messageType: EBMessageType.Command,
        traceId: input.traceId || span.spanContext().traceId,
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
            otp: command.otp || serializeOtp(),
          }

          await this.emitMessage(infoMessage)
        } catch (error) {
          const err = new UnhandledError(StatusCode.BadGateway, 'failed to send InfoInvokeTimeout message', {
            traceId: command.traceId,
            correlationId,
            error,
          })
          this.logger.error({ err, ...span.spanContext() }, `failed to send InfoInvokeTimeout message`)
          this.emit('eventbridge-error', err)
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

      this.emitMessage(command)
      return Promise.race([executionPromise, getTimeoutPromise(commandTimeout, command.traceId)])
    })
  }
}
