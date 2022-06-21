import { EBMessage, isCommand, isCommandResponse, isInfoMessage, Logger } from '../types'
import { SubscriptionStorageEntry } from './types'

export const isMessageMatchingSubscription = (
  log: Logger,
  message: EBMessage,
  subscription: SubscriptionStorageEntry,
): boolean => {
  // if message type does not match the subscription does not match
  if (!subscription.isMatchingMessageType(message.messageType)) {
    return false
  }

  if (isInfoMessage(message)) {
    // info messages do not have receivers
    if (subscription.subscription.receiver) {
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

  if (isCommandResponse(message) || isCommand(message)) {
    // if subscription is looking for specific sender we check for match
    if (subscription.subscription.sender) {
      if (
        !subscription.isMatchingSenderServiceName(message.sender.serviceName) ||
        !subscription.isMatchingSenderServiceTarget(message.sender.serviceTarget) ||
        !subscription.isMatchingSenderServiceVersion(message.sender.serviceVersion)
      ) {
        return false
      }
    }

    if (subscription.subscription.receiver) {
      if (
        !subscription.isMatchingReceiverServiceName(message.receiver.serviceName) ||
        !subscription.isMatchingReceiverServiceTarget(message.receiver.serviceTarget) ||
        !subscription.isMatchingReceiverServiceVersion(message.receiver.serviceVersion)
      ) {
        return false
      }
    }

    return true
  }

  // eg. maybe there are additional types in future
  // so every message-type we do not handle explicit will not match
  return false
}
