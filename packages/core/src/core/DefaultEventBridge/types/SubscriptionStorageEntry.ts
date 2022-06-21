import { EBMessageType, Subscription } from '../../types'

export type SubscriptionStorageEntry = {
  isMatchingMessageType(input: EBMessageType): boolean
  isMatchingSenderServiceName(input: string): boolean
  isMatchingSenderServiceVersion(input: string): boolean
  isMatchingSenderServiceTarget(input: string): boolean
  isMatchingReceiverServiceName(input: string): boolean
  isMatchingReceiverServiceVersion(input: string): boolean
  isMatchingReceiverServiceTarget(input: string): boolean
  subscription: Subscription
}
