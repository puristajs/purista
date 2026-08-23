import { join } from 'node:path/posix'

import type { Command, EBMessage } from '@purista/core/adapter'
import { convertToSnakeCase } from '@purista/core/adapter'
import type { IMqttBridge } from '../types/IMqttBridge.js'

/** Function signature for building an MQTT publish topic from a PURISTA message. */
export type GetTopicNameFn = (this: IMqttBridge, message: EBMessage) => string

/**
 * Calculates the MQTT topic name for a message which should be sent.
 *
 * Undefined address parts are replaced with `emptyTopicPartString`; all parts
 * are snake-cased to keep broker topic names stable.
 * Something like:
 * purista/
 * message_type/
 * principal_id/
 * sender_instance_id/
 * sender_name/
 * sender_version/
 * sender_target/
 * eventname/
 * sender_instance_id/
 * receiver_name/
 * receiver_version/
 * receiver_target
 *
 *
 * @param message the message to send
 * @returns the MQTT topic
 *
 */
export const getTopicName: GetTopicNameFn = function (message: EBMessage) {
	const empty = this.config.emptyTopicPartString

	return join(
		this.config.topicPrefix,
		convertToSnakeCase(message.messageType),
		convertToSnakeCase(message.principalId ?? empty),
		convertToSnakeCase(message.tenantId ?? empty),
		convertToSnakeCase(message.sender.instanceId),
		convertToSnakeCase(message.sender.serviceName),
		convertToSnakeCase(message.sender.serviceVersion),
		convertToSnakeCase(message.sender.serviceTarget),
		convertToSnakeCase(message.eventName ?? empty),
		convertToSnakeCase((message as Command).receiver?.instanceId ?? empty),
		convertToSnakeCase((message as Command).receiver?.serviceName ?? empty),
		convertToSnakeCase((message as Command).receiver?.serviceVersion ?? empty),
		convertToSnakeCase((message as Command).receiver?.serviceTarget ?? empty),
	)
}
