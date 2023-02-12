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
}
