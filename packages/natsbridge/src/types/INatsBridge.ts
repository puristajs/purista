import type { EventBridgeBaseClass } from '@purista/core/adapter'
import type { Codec, NatsConnection } from 'nats'
import type { NatsBridgeConfig } from './NatsBridgeConfig.js'

/**
 * Internal receiver shape used by exported NATS helper functions.
 *
 * Consumers normally use {@link NatsBridge}; this type is exported so topic and
 * handler helpers can be bound with a typed `this` context.
 */
export type INatsBridge = {
	/** Active NATS connection, if the bridge has been started. */
	connection: NatsConnection | undefined
	/** Codec used for NATS message payload serialization. */
	sc: Codec<unknown>
} & EventBridgeBaseClass<NatsBridgeConfig>
