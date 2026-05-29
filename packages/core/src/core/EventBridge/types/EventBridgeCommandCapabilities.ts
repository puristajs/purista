/**
 * Command request/response transport strategy used by an event bridge.
 *
 * @group Event bridge
 */
export enum EventBridgeCommandTransport {
	/** Direct request/reply transport. */
	RequestReply = 'request-reply',
	/** Dedicated reply queue transport. */
	ReplyQueue = 'reply-queue',
	/** Topic delivery correlated by ids. */
	TopicCorrelation = 'topic-correlation',
	/** HTTP request used as command transport. */
	HttpRequest = 'http-request',
	/** In-memory process-local transport. */
	InMemory = 'in-memory',
}

/**
 * Confirmation level available for command responses.
 *
 * @group Event bridge
 */
export enum EventBridgeResponseConfirmationLevel {
	/** No response confirmation from the transport. */
	None = 'none',
	/** Confirmation from the protocol client only. */
	ProtocolLevel = 'protocol-level',
	/** Broker-level publish confirmation. */
	BrokerConfirm = 'broker-confirm',
}

/**
 * Command reliability capabilities for an event bridge.
 *
 * @group Event bridge
 */
export type EventBridgeCommandCapabilities = {
	/** Command transport strategy. */
	transport: EventBridgeCommandTransport
	/** Pending invocations can be cancelled or timed out locally. */
	pendingInvocationCancellation: boolean
	/** Confirmation available when publishing command responses. */
	responseConfirmation: EventBridgeResponseConfirmationLevel
	/** Bridge supports strict command reliability validation. */
	strictMode: boolean
}
