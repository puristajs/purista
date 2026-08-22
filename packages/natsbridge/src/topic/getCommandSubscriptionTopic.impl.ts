import type { EBMessageAddress } from '@purista/core/adapter'
import { convertToSnakeCase, EBMessageType } from '@purista/core/adapter'
import type { INatsBridge } from '../types/INatsBridge.js'

/**
 * Function signature for building a NATS command subscription subject.
 */
export type GetCommandTopicFn = (this: INatsBridge, address: EBMessageAddress) => string

/**
 * Builds the NATS subject used by command handlers for one service address.
 */
export const getCommandSubscriptionTopic: GetCommandTopicFn = function (address) {
	return [
		this.config.topicPrefix,
		convertToSnakeCase(EBMessageType.Command),
		'*',
		'*',
		'*',
		'*',
		'*',
		'*',
		'*',
		'*',
		convertToSnakeCase(address.serviceName),
		convertToSnakeCase(address.serviceVersion),
		convertToSnakeCase(address.serviceTarget),
	].join('.')
}
