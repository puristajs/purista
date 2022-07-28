import { EBMessage, isCommand, isCommandResponse, isCustomMessage, isInfoMessage, Logger } from '../types'
import { SubscriptionStorageEntry } from './types'

export const isMessageMatchingSubscription = (
  _log: Logger,
  message: EBMessage,
  subscription: SubscriptionStorageEntry,
): boolean => {
  // if message type does not match, the subscription does not match
  if (!subscription.isMatchingMessageType(message.messageType)) {
    return false
  }

  // if message type does not match, the principal id does not match
  if (!subscription.isMatchingPrincipalId(message.principalId)) {
    return false
  }

  // if message type does not match, the principal id does not match
  if (!subscription.isMatchingInstanceId(message.instanceId)) {
    return false
  }

  // if we are looking for a named event, if is does not match, the subscription does not match
  if (!subscription.isMatchingEventName(message.eventName)) {
    return false
  }

  if (isInfoMessage(message)) {
    // info messages do not have receivers
    if (
      !subscription.isMatchingReceiverServiceName() ||
      !subscription.isMatchingReceiverServiceVersion() ||
      !subscription.isMatchingReceiverServiceTarget()
    ) {
      return false
    }

    // if sender does not match subscription
    if (
      !subscription.isMatchingSenderServiceName(message.sender.serviceName) ||
      !subscription.isMatchingSenderServiceTarget(message.sender.serviceTarget) ||
      !subscription.isMatchingSenderServiceVersion(message.sender.serviceVersion)
    ) {
      return false
    }

    // it is a info message and the sender is matching
    return true
  }

  if (isCommandResponse(message) || isCommand(message) || isCustomMessage(message)) {
    // if subscription is looking for specific sender we check for match
    if (
      !subscription.isMatchingSenderServiceName(message.sender.serviceName) ||
      !subscription.isMatchingSenderServiceTarget(message.sender.serviceTarget) ||
      !subscription.isMatchingSenderServiceVersion(message.sender.serviceVersion)
    ) {
      return false
    }

    if (
      !subscription.isMatchingReceiverServiceName(message.receiver?.serviceName) ||
      !subscription.isMatchingReceiverServiceTarget(message.receiver?.serviceTarget) ||
      !subscription.isMatchingReceiverServiceVersion(message.receiver?.serviceVersion)
    ) {
      return false
    }

    return true
  }

  // eg. maybe there are additional types in future
  // so every message-type we do not handle explicit will not match
  return false
}
