import type { MqttBridgeConfig } from './types/MqttBridgeConfig.js'

const SECONDS_PER_DAY = 86_400

/**
 * Returns default MQTT bridge configuration.
 *
 * Defaults target a local MQTT 5 broker on `localhost:1883`, use QoS 1 for
 * commands and subscriptions, and keep MQTT session/message expiry explicit.
 */
export const getDefaultMqttBridgeConfig = (): MqttBridgeConfig => {
	return {
		topicPrefix: 'purista',
		shareTopicName: 'sharedpurista',
		shareTopicPrefix: '$share',
		emptyTopicPartString: '__none__',

		qosCommand: 1,
		qoSSubscription: 1,

		defaultSessionExpiryInterval: 30 * SECONDS_PER_DAY,
		defaultMessageExpiryInterval: 30 * SECONDS_PER_DAY,

		host: 'localhost',
		port: 1883,
		protocol: 'mqtt',
		protocolVersion: 5,
		clean: true,
		resubscribe: true,
		allowRetries: true,

		keepalive: 10,
		reschedulePings: true,
		protocolId: 'MQTT',
		reconnectPeriod: 1_000,
		connectTimeout: 30 * 1_000,
	}
}
