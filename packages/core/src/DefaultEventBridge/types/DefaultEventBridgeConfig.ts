/**
 * The configuration for the DefaultEventBridge.
 */
export type DefaultEventBridgeConfig = {
	/** Log warnings on messages which are emitted, but could not delivered to at least one receiver */
	logWarnOnMessagesWithoutReceiver?: boolean

	/** Emit messages which have an event name set as javascript events on the event bridge instance */
	emitMessagesAsEventBridgeEvents?: boolean
}
