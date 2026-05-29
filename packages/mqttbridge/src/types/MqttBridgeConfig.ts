import type { Prettify } from '@purista/core'
import type { IClientOptions } from 'mqtt'
import type { QoS } from 'mqtt-packet'

/**
 * Configuration for {@link MqttBridge}.
 *
 * Extends MQTT.js client options. The bridge requires MQTT 5 features and uses
 * JSON payloads plus MQTT user properties for PURISTA and OpenTelemetry
 * metadata. Retry, DLQ, and durable consumer guarantees are not broker-managed
 * by this bridge.
 */
export type MqttBridgeConfig = Prettify<
	{
		/**
		 * the prefix for topic to prevent name collisions
		 *
		 * @default purista
		 */
		topicPrefix: string

		/**
		 * the prefix to be used to dynamically create topic names for shared subscriptions
		 *
		 * @default $share
		 */
		shareTopicPrefix: string

		/**
		 * the name of the shared topic (similar to pubsub name)
		 *
		 * @default sharedpurista
		 */
		shareTopicName: string

		/**
		 * The string which should be used in topics for parts, which are undefined
		 *
		 * @default __none__
		 */
		emptyTopicPartString: string

		/**
		 * QOS for command, command responses and command response subscriptions messages
		 *
		 * @default 1
		 */
		qosCommand: QoS

		/**
		 * QOS for all subscriptions
		 *
		 * @default 1
		 */
		qoSSubscription: QoS

		/**
		 * MQTT session expiry interval in seconds.
		 *
		 * @default 0
		 */
		defaultSessionExpiryInterval: number

		/**
		 * Default message expiry interval in seconds.
		 *
		 * @default 2592000
		 */
		defaultMessageExpiryInterval: number

		/**
		 * Allows MQTT.js to retry the initial connection.
		 */
		allowRetries?: boolean
	} & IClientOptions
>
