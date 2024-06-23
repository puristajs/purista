/**
 * Opentelemetry span names used by PURISTA framework
 */
export enum PuristaSpanName {
	EventBridgeEmitMessage = 'purista.emit.MessageToBridge',
	EventBridgeInvokeCommand = 'purista.command.invoke',
	EventBridgeCommandResponse = 'purista.command.response',
	EventBridgeHandleIncomingMessage = 'purista.handle.incomingMessage',

	EventBridgeCommandSent = 'purista.command.sent',
	EventBridgeCommandReceived = 'purista.command.received',
	EventBridgeCommandResponseSent = 'purista.command.response.sent',
	EventBridgeCommandResponseReceived = 'purista.command.response.received',
	EventBridgeSubscriptionEventReceived = 'purista.subscription.eventReceived',

	SecretStoreGetValue = 'purista.secretStore.getValue',
	SecretStoreSetValue = 'purista.secretStore.setValue',
	SecretStoreRemoveValue = 'purista.secretStore.removeValue',

	ConfigStoreGetValue = 'purista.configStore.getValue',
	ConfigStoreSetValue = 'purista.configStore.setValue',
	ConfigStoreRemoveValue = 'purista.configStore.removeValue',

	StateStoreGetValue = 'purista.stateStore.getValue',
	StateStoreSetValue = 'purista.stateStore.setValue',
	StateStoreRemoveValue = 'purista.stateStore.removeValue',

	KubernetesHttpRequest = 'purist.kubernetes.HttpRequest',
}
