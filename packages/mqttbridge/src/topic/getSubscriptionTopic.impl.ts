import { join } from 'node:path/posix'

import type { Subscription } from '@purista/core'
import { convertToSnakeCase } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge.js'

type GetSubscriptionTopicFn = (this: MqttBridge, subscription: Subscription) => string

export const getSubscriptionTopic: GetSubscriptionTopicFn = function (subscription) {
	return join(
		this.config.topicPrefix,
		convertToSnakeCase(subscription.messageType ?? '+'),
		convertToSnakeCase(subscription.principalId ?? '+'),
		convertToSnakeCase(subscription.tenantId ?? '+'),
		convertToSnakeCase(subscription.sender?.instanceId ?? '+'),
		convertToSnakeCase(subscription.sender?.serviceName ?? '+'),
		convertToSnakeCase(subscription.sender?.serviceVersion ?? '+'),
		convertToSnakeCase(subscription.sender?.serviceTarget ?? '+'),
		convertToSnakeCase(subscription.eventName ?? '+'),
		convertToSnakeCase(subscription.receiver?.instanceId ?? '+'),
		convertToSnakeCase(subscription.receiver?.serviceName ?? '+'),
		convertToSnakeCase(subscription.receiver?.serviceVersion ?? '+'),
		convertToSnakeCase(subscription.receiver?.serviceTarget ?? '+'),
	)
}
