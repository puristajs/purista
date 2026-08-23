import { join } from 'node:path/posix'

import { convertToSnakeCase } from '@purista/core/adapter'

import type { IMqttBridge } from '../types/IMqttBridge.js'

/**
 * Function signature for building this instance's MQTT command response topic filter.
 */
export type GetCommandResponseSubscriptionTopicFn = (this: IMqttBridge) => string
/**
 * Builds the MQTT topic filter used to receive command responses for the
 * current bridge instance.
 */
export const getCommandResponseSubscriptionTopic: GetCommandResponseSubscriptionTopicFn = function () {
	return join(
		this.config.topicPrefix,
		'+',
		'+',
		'+',
		'+',
		'+',
		'+',
		'+',
		'+',
		convertToSnakeCase(this.instanceId as string),
		'+',
		'+',
		'+',
	)
}
