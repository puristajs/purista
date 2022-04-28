import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import { EBMessageType } from '../EBMessageType.enum'
import { SubscriptionId } from './SubscriptionId'

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
  callback(subscriptionId: SubscriptionId, message: EBMessage): Promise<void>
  subscriber: EBMessageAddress
}
