import type { EBMessageAddress } from '@purista/core'
import { EBMessageType, convertToSnakeCase } from '@purista/core'

import type { NatsBridge } from '../NatsBridge.js'

type GetCommandTopicFn = (this: NatsBridge, address: EBMessageAddress) => string

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
