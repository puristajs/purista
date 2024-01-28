/**
 * Changes the canEmit proxy type to given type
 *
 * serviceName.ServiceVersion.FunctionName becomes type of SinonStub
 */
export type FromEmitToOtherType<Entry, NewType> = {
  [TKey in keyof Entry]: NewType
}
