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
