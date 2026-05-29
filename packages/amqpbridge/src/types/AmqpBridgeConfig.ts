import type { Options, SocketOptions } from 'amqplib'

import type { Encoder } from './Encoder.js'
import type { Encrypter } from './Encrypter.js'

/**
 * Configuration for {@link AmqpBridge}.
 *
 * The bridge expects an AMQP broker with headers exchange support. Durable
 * command and subscription consumers rely on durable queues and manual
 * acknowledgements. Payload handling is configured separately for serialization
 * and encryption; the default encryption handler is plain pass-through, so
 * sensitive payloads require an application-provided encrypter.
 *
 * @see [amqplib documentation](https://amqp-node.github.io/amqplib/)
 */
export type AmqpBridgeConfig = {
	/** AMQP headers exchange name to use. @default purista */
	exchangeName?: string
	/** Queue prefix for PURISTA queues except broker-created exclusive queues. @default purista */
	namePrefix?: string
	/** AMQP exchange assertion options. */
	exchangeOptions?: Options.AssertExchange | undefined
	/** Maximum unacknowledged messages per manual-ack consumer channel. */
	prefetch?: number
	/** Dead-letter exchange name applied to durable command queues when set. */
	deadLetterExchangeName?: string
	/** Dead-letter routing key used by durable command queues and subscription dead-letter handoff. */
	deadLetterRoutingKey?: string
	/** AMQP broker URL or connection options. @default amqp://localhost */
	url?: string | Options.Connect
	/** Socket options passed to amqplib. */
	socketOptions?: SocketOptions
	/** Content-type encoders used for AMQP payload serialization. @default jsonEncoder */
	encoder?: Encoder
	/** Content-encoding encrypters used for AMQP payload protection. @default plainEncrypter */
	encrypter?: Encrypter
}
