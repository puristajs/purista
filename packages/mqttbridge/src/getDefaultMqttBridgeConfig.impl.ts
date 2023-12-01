import type { MqttBridgeConfig } from './types'

const SECONDS_PER_DAY = 86_400

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
