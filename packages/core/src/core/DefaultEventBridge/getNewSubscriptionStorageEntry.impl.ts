import wcmatch from 'wildcard-match'

import { EBMessageType, Subscription } from '../types'
import { SubscriptionStorageEntry } from './types'

export const getNewSubscriptionStorageEntry = (subscription: Subscription): SubscriptionStorageEntry => {
  const entry: SubscriptionStorageEntry = {
    isMatchingMessageType: () => true,
    isMatchingSenderServiceName: () => true,
    isMatchingSenderServiceVersion: () => true,
    isMatchingSenderServiceTarget: () => true,
    isMatchingReceiverServiceName: () => true,
    isMatchingReceiverServiceVersion: () => true,
    isMatchingReceiverServiceTarget: () => true,
    isMatchingEventName: () => true,
    subscription,
  }

  if (subscription.messageTypes) {
    const messageTypes = subscription.messageTypes
    entry.isMatchingMessageType = (input: EBMessageType) => messageTypes.includes(input)
  }

  if (subscription.eventName) {
    const matchingFn = wcmatch(subscription.eventName, '.')
    entry.isMatchingEventName = (input: string) => matchingFn(input)
  }

  if (subscription.sender?.serviceName) {
    const matchingFn = wcmatch(subscription.sender.serviceName, '.')
    entry.isMatchingSenderServiceName = (input: string) => matchingFn(input)
  }

  if (subscription.sender?.serviceVersion) {
    const matchingFn = wcmatch(subscription.sender.serviceVersion, '.')
    entry.isMatchingSenderServiceVersion = (input: string) => matchingFn(input)
  }

  if (subscription.sender?.serviceTarget) {
    const matchingFn = wcmatch(subscription.sender.serviceTarget, '.')
    entry.isMatchingSenderServiceTarget = (input: string) => matchingFn(input)
  }

  if (subscription.receiver?.serviceName) {
    const matchingFn = wcmatch(subscription.receiver.serviceName, '.')
    entry.isMatchingReceiverServiceName = (input: string) => matchingFn(input)
  }

  if (subscription.receiver?.serviceVersion) {
    const matchingFn = wcmatch(subscription.receiver.serviceVersion, '.')
    entry.isMatchingReceiverServiceVersion = (input: string) => matchingFn(input)
  }

  if (subscription.receiver?.serviceTarget) {
    const matchingFn = wcmatch(subscription.receiver.serviceTarget, '.')
    entry.isMatchingReceiverServiceTarget = (input: string) => matchingFn(input)
  }

  return entry
}
