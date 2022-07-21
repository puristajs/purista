import { Stream } from 'node:stream'

import { getDefaultEventBridgeConfig } from '../config'
import { HandledError } from '../HandledError.impl'
import {
  getCleanedMessage,
  getCommandQueueName,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
  getSubscriptionQueueName,
  getTimeoutPromise,
} from '../helper'
import {
  Command,
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
  Subscription,
} from '../types'
import { UnhandledError } from '../UnhandledError.impl'
import { getNewSubscriptionStorageEntry } from './getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from './isMessageMatchingSubscription.impl'
import { SubscriptionStorageEntry } from './types'

type PendigInvocation = {
  resolve(responsePayload: unknown): void
  reject(error: UnhandledError | HandledError): void
}

/**
 * Simple implementation of some simple in-memory event bridge.
 * Does not support threads and does not need any external databases.
 */
export class DefaultEventBridge implements EventBridge {
  protected log: Logger
  protected config: EventBridgeEnsuredDefaults
  protected writeStream = new Stream.Writable({ objectMode: true })
  protected readStream = new Stream.Readable({
    objectMode: true,
    read() {
      /* nothing to do here */
    },
  })

  protected serviceFunctions = new Map<string, (message: Command) => void>()
  protected pendingInvocations = new Map<EBMessageId, PendigInvocation>()

  protected subscriptions = new Map<string, SubscriptionStorageEntry>()
  constructor(baseLogger: Logger, conf: EventBridgeConfig = getDefaultEventBridgeConfig()) {
    this.config = {
      ...getDefaultEventBridgeConfig(),
      ...conf,
    }
    this.log = baseLogger.getChildLogger({ name: 'eventBridge' })

    const write = (message: EBMessage, _encoding: string, next: (error?: Error) => void) => {
      try {
        if (isCommand(message)) {
          const mapEntry = this.serviceFunctions.get(getCommandQueueName(message.receiver))
          if (!mapEntry) {
            this.log.error('received invalid command', getCleanedMessage(message))
            return next(new Error('received invalid command'))
          }
          mapEntry(message)
          return next()
        }

        if (isCommandResponse(message)) {
          const mapEntry = this.pendingInvocations.get(message.correlationId)
          if (!mapEntry) {
            this.log.error('received invalid command response', getCleanedMessage(message))
            return next(new Error('received invalid command response'))
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
          this.log.trace('info message', message)
          return next()
        }

        this.log.error('received invalid message', message)
        return next()
      } catch (error) {
        return next(error as Error)
      }
    }

    this.writeStream._write = write.bind(this)

    this.readStream.pipe(this.writeStream)

    this.readStream.on('data', (message: EBMessage) => {
      this.subscriptions.forEach((subscription) => {
        if (isMessageMatchingSubscription(this.log, message, subscription)) {
          subscription.cb(message)
        }
      })
    })
  }

  /**
   * Get default time out.
   * It is the maximum time a command should be responded.
   */
  get defaultTtl() {
    return this.config.defaultTtl
  }

  /**
   * Get instance id.
   * The id of current eventbus instance.
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
  async registerServiceFunction(address: EBMessageAddress, cb: (message: Command) => void): Promise<string> {
    const queueName = getCommandQueueName(address)
    this.serviceFunctions.set(queueName, cb)
    return queueName
  }

  async unregisterServiceFunction(address: EBMessageAddress): Promise<void> {
    const queueName = getCommandQueueName(address)
    this.serviceFunctions.delete(queueName)
  }

  async registerSubscription(subscription: Subscription, cb: (message: EBMessage) => Promise<void>): Promise<string> {
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
  async emit(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
  ): Promise<Readonly<EBMessage>> {
    return new Promise((resolve, reject) => {
      try {
        const msg = Object.freeze({
          ...message,
          id: getNewEBMessageId(),
          timestamp: Date.now(),
          traceId: message.traceId || getNewTraceId(),
          instanceId: this.config.instanceId,
        })

        this.readStream.push(msg)
        resolve(msg as Readonly<EBMessage>)
      } catch (err) {
        reject(err)
      }
    })
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    ttl = this.config.defaultTtl,
  ): Promise<T> {
    const correlationId = getNewCorrelationId()

    const command = Object.freeze({
      ...input,
      id: getNewEBMessageId(),
      instanceId: this.instanceId,
      correlationId: getNewCorrelationId(),
      timestamp: Date.now(),
      messageType: EBMessageType.Command,
      traceId: input.traceId || getNewTraceId(),
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

        await this.emit(infoMessage)
      } catch (err) {
        this.log
          .getChildLogger({ requestId: command.traceId })
          .error(`failed to send InfoInvokeTimeout message for ${correlationId}`, err)
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

    this.emit(command)
    return Promise.race([executionPromise, getTimeoutPromise(ttl, command.traceId)])
  }
}
