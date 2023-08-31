import { join } from 'node:path/posix'

import { Command, convertToSnakeCase, EBMessage } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge'

type GetTopicNameFn = (this: MqttBridge, message: EBMessage) => string

/**
 * Calculates the MQTT topic name for a message which should be sent.
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
    convertToSnakeCase(message.principalId || empty),
    convertToSnakeCase(message.tenantId || empty),
    convertToSnakeCase(message.sender.instanceId),
    convertToSnakeCase(message.sender.serviceName),
    convertToSnakeCase(message.sender.serviceVersion),
    convertToSnakeCase(message.sender.serviceTarget),
    convertToSnakeCase(message.eventName || empty),
    convertToSnakeCase((message as Command).receiver?.instanceId || empty),
    convertToSnakeCase((message as Command).receiver?.serviceName || empty),
    convertToSnakeCase((message as Command).receiver?.serviceVersion || empty),
    convertToSnakeCase((message as Command).receiver?.serviceTarget || empty),
  )
}
