import { join } from 'node:path/posix'

import { convertToSnakeCase, Subscription } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge'

type GetSubscriptionTopicFn = (this: MqttBridge, subscription: Subscription) => string

export const getSubscriptionTopic: GetSubscriptionTopicFn = function (subscription) {
  return join(
    this.config.topicPrefix,
    convertToSnakeCase(subscription.messageType || '+'),
    convertToSnakeCase(subscription.instanceId || '+'),
    convertToSnakeCase(subscription.principalId || '+'),
    convertToSnakeCase(subscription.sender?.serviceName || '+'),
    convertToSnakeCase(subscription.sender?.serviceVersion || '+'),
    convertToSnakeCase(subscription.sender?.serviceTarget || '+'),
    convertToSnakeCase(subscription.eventName || '+'),
    convertToSnakeCase(subscription.receiver?.serviceName || '+'),
    convertToSnakeCase(subscription.receiver?.serviceVersion || '+'),
    convertToSnakeCase(subscription.receiver?.serviceTarget || '+'),
  )
}
