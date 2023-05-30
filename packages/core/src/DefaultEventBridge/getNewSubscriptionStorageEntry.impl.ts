import { CustomMessage, EBMessage, EBMessageType, Subscription } from '../core'
import { SubscriptionStorageEntry } from './types'

export const getNewSubscriptionStorageEntry = (
  subscription: Subscription,
  cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
): SubscriptionStorageEntry => {
  const entry: SubscriptionStorageEntry = {
    isMatchingMessageType: () => true,
    isMatchingSenderServiceName: () => true,
    isMatchingSenderServiceVersion: () => true,
    isMatchingSenderServiceTarget: () => true,
    isMatchingSenderInstanceId: () => true,
    isMatchingReceiverServiceName: () => true,
    isMatchingReceiverServiceVersion: () => true,
    isMatchingReceiverServiceTarget: () => true,
    isMatchingReceiverInstanceId: () => true,
    isMatchingPrincipalId: () => true,
    isMatchingEventName: () => true,
    emitEventName: subscription.emitEventName,
    cb,
  }

  if (subscription.principalId) {
    entry.isMatchingPrincipalId = (input: EBMessageType) => input === subscription.principalId
  }

  if (subscription.sender?.instanceId) {
    entry.isMatchingSenderInstanceId = (input: EBMessageType) => input === subscription.sender?.instanceId
  }

  if (subscription.receiver?.instanceId) {
    entry.isMatchingReceiverInstanceId = (input: EBMessageType) => input === subscription.receiver?.instanceId
  }

  if (subscription.messageType) {
    entry.isMatchingMessageType = (input: EBMessageType) => input === subscription.messageType
  }

  if (subscription.eventName) {
    entry.isMatchingEventName = (input?: string) => input === subscription.eventName
  }

  if (subscription.sender?.serviceName) {
    entry.isMatchingSenderServiceName = (input?: string) => input === subscription.sender?.serviceName
  }

  if (subscription.sender?.serviceVersion) {
    entry.isMatchingSenderServiceVersion = (input?: string) => input === subscription.sender?.serviceVersion
  }

  if (subscription.sender?.serviceTarget) {
    entry.isMatchingSenderServiceTarget = (input?: string) => input === subscription.sender?.serviceTarget
  }

  if (subscription.receiver?.serviceName) {
    entry.isMatchingReceiverServiceName = (input?: string) => input === subscription.receiver?.serviceName
  }

  if (subscription.receiver?.serviceVersion) {
    entry.isMatchingReceiverServiceVersion = (input?: string) => input === subscription.receiver?.serviceVersion
  }

  if (subscription.receiver?.serviceTarget) {
    entry.isMatchingReceiverServiceTarget = (input?: string) => input === subscription.receiver?.serviceTarget
  }

  return entry
}
