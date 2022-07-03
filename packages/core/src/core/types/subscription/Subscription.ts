import type { EBMessage } from '../EBMessage'
import type { EBMessageAddress } from '../EBMessageAddress'
import type { EBMessageType } from '../EBMessageType.enum'
import type { SubscriptionId } from './SubscriptionId'

/**
 * A subscription managed by the event bridge
 */
export type Subscription = {
  sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  messageTypes?: EBMessageType[]
  eventName?: string
  callback(subscriptionId: SubscriptionId, message: EBMessage): Promise<void>
  subscriber: EBMessageAddress
}
