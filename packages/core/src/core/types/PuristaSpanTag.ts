/**
 * Opentelemetry tags set by PURISTA framework
 */
export enum PuristaSpanTag {
  SenderServiceName = 'purista.sender.name',
  SenderServiceVersion = 'purista.sender.version',
  SenderServiceTarget = 'purista.sender.target',

  ReceiverServiceName = 'purista.receiver.name',
  ReceiverServiceVersion = 'purista.receiver.version',
  ReceiverServiceTarget = 'purista.receiver.target',
}
