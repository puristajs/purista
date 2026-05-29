import type { DefinitionEventBridgeConsumerFailureHandling } from './DefinitionEventBridgeConsumerFailureHandling.js'

/**
 * Event bridge delivery requirements requested by command, stream, or subscription definitions.
 *
 * These settings are validated against the selected bridge capabilities. In
 * strict reliability modes, startup should fail when the bridge cannot satisfy
 * the requested semantics instead of silently degrading behavior.
 *
 * @group Event bridge
 */
export type DefinitionEventBridgeConfig = {
	/**
	 * Advise the underlaying message broker to store messages if no consumer is available.
	 * Messages will be send as soon as the service is able to consume.
	 * */
	durable: boolean
	/**
	 * Send the acknowledge to message broker as soon as the message arrives
	 * - defaults to true for commands
	 * - defaults to true for subscriptions
	 *
	 * */
	autoacknowledge: boolean
	/**
	 * If set to true, the event bridge is adviced to deliver one message to at least one consumer instance.
	 * True is the default value.
	 * If set to false, the event bridge is adviced to deliver one message to all consumer instances.
	 *
	 * Use case: Receiving Info of message, which need to be passed to all instance to keep information in sync.
	 *
	 * In serverless environments, this flag should not have any effect
	 *
	 * @default true
	 */
	shared: boolean
	/**
	 * Advisory retry and dead-letter handling for consumer-style registrations.
	 *
	 * This is primarily relevant for subscriptions and other push consumers.
	 * Adapters may ignore or partially honor these settings when the provider
	 * lacks broker-side retry or dead-letter support.
	 */
	consumerFailureHandling?: DefinitionEventBridgeConsumerFailureHandling
}
