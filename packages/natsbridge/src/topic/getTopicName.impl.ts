import type { Command, EBMessage } from '@purista/core'
import { convertToSnakeCase } from '@purista/core'

import type { INatsBridge } from '../types/INatsBridge.js'

/**
 * Function signature for building a NATS publish subject from a PURISTA message.
 */
export type GetTopicNameFn = (this: INatsBridge, message: EBMessage) => string

/**
 * Calculates the NATS topic name for a message which should be sent.
 *
 * Undefined address parts are replaced with `emptyTopicPartString`; all parts
 * are snake-cased to keep broker subjects stable.
 * Something like:
 * purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target
 *
 *
 * @param message the message to send
 * @returns the NATS topic
 *
 */
export const getTopicName: GetTopicNameFn = function (message: EBMessage) {
	const empty = this.config.emptyTopicPartString

	return [
		this.config.topicPrefix,
		convertToSnakeCase(message.messageType),
		convertToSnakeCase(message.principalId ?? empty),
		convertToSnakeCase(message.tenantId ?? empty),
		convertToSnakeCase(message.sender.instanceId ?? empty),
		convertToSnakeCase(message.sender.serviceName),
		convertToSnakeCase(message.sender.serviceVersion),
		convertToSnakeCase(message.sender.serviceTarget),
		convertToSnakeCase(message.eventName ?? empty),
		convertToSnakeCase((message as Command).receiver?.instanceId ?? empty),
		convertToSnakeCase((message as Command).receiver?.serviceName ?? empty),
		convertToSnakeCase((message as Command).receiver?.serviceVersion ?? empty),
		convertToSnakeCase((message as Command).receiver?.serviceTarget ?? empty),
	].join('.')
}
