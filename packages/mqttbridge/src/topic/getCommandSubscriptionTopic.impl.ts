import { join } from 'node:path/posix'

import type { EBMessageAddress } from '@purista/core/adapter'
import { convertToSnakeCase, EBMessageType } from '@purista/core/adapter'
import type { IMqttBridge } from '../types/IMqttBridge.js'

/**
 * Function signature for building an MQTT command subscription topic filter.
 */
export type GetCommandTopicFn = (this: IMqttBridge, address: EBMessageAddress) => string

/**
 * Builds the MQTT topic filter used by command handlers for one service
 * address.
 */
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
