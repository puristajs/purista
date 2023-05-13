import { Prettify } from '@purista/core'
import type { IClientOptions, QoS } from 'mqtt'

/**
 * the configuration for the MQTT event bridge
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
     * @default purista
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
     * Indicates if a command response should be published a second time.
     * If the command response gets published, it will be published to the regular topic pattern.
     * The QOS and expiry will be set to subscription configuration values.
     *
     * If set to `never`, subscription might not get messages they are expecting because of the timing.
     *
     * If set to `always`, every command response is published.
     * Because there might not be a consumer for every message, the broker will store the messages until the `defaultMessageExpiryInterval` is reached.
     * This might result in a high ressource consumption of the broker.
     *
     * If set to `eventOnly`, only success responses which have a event name set, are published twice.
     * There, we expect, that an event has at least one consumer subscription and the broker does not unnecessarily stores messages for a long time.
     *
     * @default eventOnly
     */
    commandResponsePublishTwice: 'always' | 'eventOnly' | 'eventAndError' | 'never'

    /**
     *
     * @default 0
     */
    defaultSessionExpiryInterval: number

    /**
     * the message expiry interval in seconds
     *
     * @default
     */
    defaultMessageExpiryInterval: number

    /**
     * allow retry of the initial connect
     */
    allowRetries?: boolean
  } & IClientOptions
>
