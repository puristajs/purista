import { convertToSnakeCase, Subscription } from '@purista/core'

import type { NatsBridge } from '../NatsBridge'

type GetSubscriptionTopicFn = (this: NatsBridge, subscription: Subscription) => string

export const getSubscriptionTopic: GetSubscriptionTopicFn = function (subscription) {
  return [
    this.config.topicPrefix,
    convertToSnakeCase(subscription.messageType || '*'),
    convertToSnakeCase(subscription.instanceId || '*'),
    convertToSnakeCase(subscription.principalId || '*'),
    convertToSnakeCase(subscription.sender?.serviceName || '*'),
    convertToSnakeCase(subscription.sender?.serviceVersion || '*'),
    convertToSnakeCase(subscription.sender?.serviceTarget || '*'),
    convertToSnakeCase(subscription.eventName || '*'),
    convertToSnakeCase(subscription.receiver?.serviceName || '*'),
    convertToSnakeCase(subscription.receiver?.serviceVersion || '*'),
    convertToSnakeCase(subscription.receiver?.serviceTarget || '*'),
  ].join('.')
}
