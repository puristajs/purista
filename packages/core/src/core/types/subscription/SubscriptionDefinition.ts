import type { EBMessage } from '../EBMessage'
import type { EBMessageType } from '../EBMessageType.enum'
import { InstanceId } from '../InstanceId'
import { PrincipalId } from '../PrincipalId'
import { ServiceClass } from '../ServiceClass'
import { SubscriptionFunction } from './SubscriptionFunction'
import { SubscriptionSettings } from './SubscriptionSettings'

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
  instanceId?: InstanceId
  principalId?: PrincipalId
  settings: SubscriptionSettings
}
