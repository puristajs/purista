import type { Subscription } from '@purista/core'
import { convertToSnakeCase } from '@purista/core'
import type { INatsBridge } from '../types/INatsBridge.js'

/**
 * Function signature for building a NATS subscription subject filter.
 */
export type GetSubscriptionTopicFn = (this: INatsBridge, subscription: Subscription) => string

/**
 * Builds the NATS subject filter for a PURISTA subscription definition.
 *
 * Unspecified subscription fields become NATS `*` wildcards.
 */
export const getSubscriptionTopic: GetSubscriptionTopicFn = function (subscription) {
	return [
		this.config.topicPrefix,
		convertToSnakeCase(subscription.messageType ?? '*'),
		convertToSnakeCase(subscription.principalId ?? '*'),
		convertToSnakeCase(subscription.tenantId ?? '*'),
		convertToSnakeCase(subscription.sender?.instanceId ?? '*'),
		convertToSnakeCase(subscription.sender?.serviceName ?? '*'),
		convertToSnakeCase(subscription.sender?.serviceVersion ?? '*'),
		convertToSnakeCase(subscription.sender?.serviceTarget ?? '*'),
		convertToSnakeCase(subscription.eventName ?? '*'),
		convertToSnakeCase(subscription.receiver?.instanceId ?? '*'),
		convertToSnakeCase(subscription.receiver?.serviceName ?? '*'),
		convertToSnakeCase(subscription.receiver?.serviceVersion ?? '*'),
		convertToSnakeCase(subscription.receiver?.serviceTarget ?? '*'),
	].join('.')
}
