import { CustomMessage, EBMessage, EBMessageType, InstanceId, PrincipalId } from '../../core'

export type SubscriptionStorageEntry = {
  isMatchingMessageType(input: EBMessageType): boolean
  isMatchingSenderServiceName(input?: string): boolean
  isMatchingSenderServiceVersion(input?: string): boolean
  isMatchingSenderServiceTarget(input?: string): boolean
  isMatchingReceiverServiceName(input?: string): boolean
  isMatchingReceiverServiceVersion(input?: string): boolean
  isMatchingReceiverServiceTarget(input?: string): boolean
  isMatchingEventName(input?: string): boolean
  isMatchingPrincipalId(input?: PrincipalId): boolean
  isMatchingInstanceId(input?: InstanceId): boolean
  emitEventName?: string
  cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>
}
