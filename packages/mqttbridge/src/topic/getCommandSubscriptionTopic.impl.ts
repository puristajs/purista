import { join } from 'node:path/posix'

import type { EBMessageAddress } from '@purista/core'
import { EBMessageType, convertToSnakeCase } from '@purista/core'
import type { IMqttBridge } from '../types/IMqttBridge.js'

type GetCommandTopicFn = (this: IMqttBridge, address: EBMessageAddress) => string

export const getCommandSubscriptionTopic: GetCommandTopicFn = function (address) {
	return join(
		this.config.topicPrefix,
		convertToSnakeCase(EBMessageType.Command),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase('+'),
		convertToSnakeCase(address.serviceName),
		convertToSnakeCase(address.serviceVersion),
		convertToSnakeCase(address.serviceTarget),
	)
}
