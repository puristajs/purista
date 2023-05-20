import { Prettify } from '@purista/core'
import type { ConnectionOptions } from 'nats'
/**
 * the configuration for the NATS event bridge
 */
export type NatsBridgeConfig = Prettify<
  {
    /**
     * the prefix for topic to prevent name collisions
     *
     * @default purista
     */
    topicPrefix: string

    /**
     * The string which should be used in topics for parts, which are undefined
     *
     * @default __none__
     */
    emptyTopicPartString: string

    /**
     * Indicates if a command response should be published a second time.
     * If the command response gets published, it will be published to the regular topic pattern.
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
     * the message expiry interval in seconds
     *
     * @default 30 days in seconds
     */
    defaultMessageExpiryInterval: number

    /**
     * maximum messages to run in parallel per subscription
     * 10 means, each subscription can handle 10 calls at the same time
     *
     * @default 10
     */
    maxMessages: number
  } & ConnectionOptions
>
