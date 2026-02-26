import type { EBMessageAddress } from '@purista/core'
import { convertToSnakeCase, EBMessageType } from '@purista/core'
import type { INatsBridge } from '../types/INatsBridge.js'

export type GetCommandTopicFn = (this: INatsBridge, address: EBMessageAddress) => string

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
