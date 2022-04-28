import { getDefaultEventBridgeConfig } from '../config'
import { getNewCorrelationId, getNewSubscriptionId, getNewTraceId } from '../helper'
import {
  EBMessage,
  EBMessageAddress,
  EventBridge,
  EventBridgeConfig,
  isInfoMessage,
  Logger,
  Subscription,
  SubscriptionId,
} from '../types'
import { getNewSubscriptionStorageEntry } from './getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from './isMessageMatchingSubscription.impl'
import { SubscriptionStorageEntry } from './types'

/**
 * Simple implementation of some simple in-memory event bridge.
 * Does not support threads and does not need any external databases.
 */
export class DefaultEventBridge implements EventBridge {
  private log: Logger
  private config: EventBridgeConfig

  protected subscriptions = new Map<string, SubscriptionStorageEntry>()
  constructor(baseLogger: Logger, conf: EventBridgeConfig = getDefaultEventBridgeConfig()) {
    this.config = conf
    this.log = baseLogger.getChildLogger({ name: 'eventBridge' })
  }

  /**
   * Get default time out.
   * It is the maximum time a command should be responded.
   */
  get defaultTtl() {
    return this.config.defaultTtl
  }

  /**
   * Emit a new message to event bridge to be delivered to receiver
   *
   * @param message EBMessage
   */
  async emit(message: EBMessage) {
    const msg: EBMessage = {
      ...message,
      timestamp: Date.now(),
      traceId: message.traceId || getNewTraceId(),
      correlationId: message.correlationId || getNewCorrelationId(),
    }

    if (isInfoMessage(msg)) {
      this.log.trace(
        `${msg.messageType} from ${msg.sender.serviceName} ${msg.sender.serviceVersion} ${msg.sender.serviceTarget}`,
      )
    } else {
      this.log.trace(
        `${msg.messageType} ${msg.receiver.serviceTarget} to ${msg.receiver.serviceName} ${msg.receiver.serviceVersion} from ${msg.sender.serviceName} ${msg.sender.serviceVersion} ${msg.sender.serviceTarget}`,
      )
    }

    this.subscriptions.forEach((value, subscriptionId) => {
      if (!isMessageMatchingSubscription(this.log, msg, value)) {
        return
      }

      value.subscription.callback(subscriptionId, msg).catch((error) =>
        this.log.error('error in callback', error, {
          ...msg,
          command: '***removed from log***',
        }),
      )
    })
  }

  /**
   * Subscribe to specified event bridge message(s)
   * Means listen for messages
   *
   * @param subscription Subscription
   * @returns Promise<SubscriptionId>
   */
  async subscribe(subscription: Subscription): Promise<SubscriptionId> {
    const subscriptionId = getNewSubscriptionId()
    this.subscriptions.set(subscriptionId, getNewSubscriptionStorageEntry(subscription))
    return subscriptionId
  }

  /**
   * Unsubscribe a single subscription.
   *
   * @param subscriptionId
   */
  async unsubscribe(subscriptionId: SubscriptionId) {
    this.subscriptions.delete(subscriptionId)
  }

  /**
   * Unsubscribes all subscriptions for given Service.
   *
   * @param subscriptionId
   */
  async unsubscribeService(service: EBMessageAddress): Promise<void> {
    this.subscriptions.forEach((value, key) => {
      if (
        value.subscription.subscriber.serviceName === service.serviceName &&
        value.subscription.subscriber.serviceVersion === service.serviceVersion
      ) {
        this.subscriptions.delete(key)
      }
    })
  }
}
