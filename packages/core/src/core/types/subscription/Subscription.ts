import type { EBMessageAddress } from '../EBMessageAddress'
import type { EBMessageType } from '../EBMessageType.enum'
import { InstanceId } from '../InstanceId'
import { PrincipalId } from '../PrincipalId'
import { SubscriptionSettings } from './SubscriptionSettings'

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
  messageType?: EBMessageType
  eventName?: string
  principalId?: PrincipalId
  instanceId?: InstanceId
  subscriber: EBMessageAddress
  settings: SubscriptionSettings
}
