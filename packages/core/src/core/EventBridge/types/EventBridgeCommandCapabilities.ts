export enum EventBridgeCommandTransport {
	RequestReply = 'request-reply',
	ReplyQueue = 'reply-queue',
	TopicCorrelation = 'topic-correlation',
	HttpRequest = 'http-request',
	InMemory = 'in-memory',
}

export enum EventBridgeResponseConfirmationLevel {
	None = 'none',
	ProtocolLevel = 'protocol-level',
	BrokerConfirm = 'broker-confirm',
}

export type EventBridgeCommandCapabilities = {
	transport: EventBridgeCommandTransport
	pendingInvocationCancellation: boolean
	responseConfirmation: EventBridgeResponseConfirmationLevel
	strictMode: boolean
}
