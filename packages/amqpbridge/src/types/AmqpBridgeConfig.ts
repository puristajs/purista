import type { Options, SocketOptions } from 'amqplib'

import type { Encoder } from './Encoder.js'
import type { Encrypter } from './Encrypter.js'

/**
 * AmqpBridge bridge config
 *
 * @see [amqplib documentation](https://amqp-node.github.io/amqplib/)
 */
export type AmqpBridgeConfig = {
	/** the AMQP exchage name to be used @default purista */
	exchangeName?: string
	/** the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request @default purista */
	namePrefix?: string
	/** the AMQP exchange options */
	exchangeOptions?: Options.AssertExchange | undefined
	/** max unacked messages per consumer channel */
	prefetch?: number
	/** optional dead letter exchange name used for durable command/subscription queues */
	deadLetterExchangeName?: string
	/** optional dead letter routing key used for durable command/subscription queues */
	deadLetterRoutingKey?: string
	/** the AMQP broker url @default amqp://localhost */
	url?: string | Options.Connect
	/** socket options */
	socketOptions?: SocketOptions
	/** the encoder(s) to be used for AMQP messages @default jsonEncoder  */
	encoder?: Encoder
	/** the encrypter(s) to be used for AMQP messages @default plain  */
	encrypter?: Encrypter
}
