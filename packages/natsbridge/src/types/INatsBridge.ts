import type { EventBridgeBaseClass } from '@purista/core'
import type { Codec, NatsConnection } from 'nats'
import type { NatsBridgeConfig } from './NatsBridgeConfig.js'

export type INatsBridge = {
	connection: NatsConnection | undefined
	sc: Codec<any>
} & EventBridgeBaseClass<NatsBridgeConfig>
