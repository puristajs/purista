import { join } from 'node:path/posix'

import type { IMqttBridge } from '../types/IMqttBridge.js'

/**
 * Function signature for wrapping an MQTT topic as a shared subscription.
 */
export type GetSharedTopicNameFn = (this: IMqttBridge, topic: string) => string

/**
 * Wraps a topic with the configured MQTT shared-subscription prefix and group.
 */
export const getSharedTopicName: GetSharedTopicNameFn = function (topic: string) {
	return join(this.config.shareTopicPrefix, this.config.shareTopicName, topic)
}
