/**
 * Opentelemetry span names used by PURISTA framework
 */
export enum PuristaSpanName {
  EventBridgeEmitMessage = 'purista.emitMessageToBridge',
  EventBridgeInvokeCommand = 'purista.commandSent',
  EventBridgeCommandResponse = 'purista.commandResponse',
  EventBridgeHandleIncomingMessage = 'purista.handleIncomingMessage',

  EventBridgeCommandSent = 'purista.commandSent',
  EventBridgeCommandReceived = 'purista.commandReceived',
  EventBridgeCommandResponseSent = 'purista.commandResponseSent',
  EventBridgeCommandResponseReceived = 'purista.commandResponseReceived',
  EventBridgeSubscriptionEventReceived = 'purista.subscriptionEventReceived',

  SecretStoreGetValue = 'purista.secretStoreGetValue',
  SecretStoreSetValue = 'purista.secretStoreSetValue',
  SecretStoreRemoveValue = 'purista.secretStoreRemoveValue',
  ConfigStoreGetValue = 'purista.configStoreGetValue',
  ConfigStoreSetValue = 'purista.configStoreSetValue',
  ConfigStoreRemoveValue = 'purista.configStoreRemoveValue',
  StateStoreGetValue = 'purista.stateStoreGetValue',
  StateStoreSetValue = 'purista.stateStoreSetValue',
  StateStoreRemoveValue = 'purista.stateStoreRemoveValue',
}
