import type { EBMessage } from '../EBMessage'
import type { EBMessageType } from '../EBMessageType.enum'
import { ServiceClass } from '../ServiceClass'
import { SubscriptionFunction } from './SubscriptionFunction'

export type SubscriptionDefinition<ServiceClassType = ServiceClass, MessageType = EBMessage, Payload = unknown> = {
  subscriptionName: string
  subscriptionDescription: string
  call: SubscriptionFunction<ServiceClassType, MessageType, Payload>
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
  messageType?: EBMessageType
  eventName?: string
}
