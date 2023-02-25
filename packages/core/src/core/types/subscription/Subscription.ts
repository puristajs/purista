import { EBMessageAddress } from '../EBMessageAddress'
import { EBMessageType } from '../EBMessageType.enum'
import { InstanceId } from '../InstanceId'
import { PrincipalId } from '../PrincipalId'
import { SubscriptionSettings } from './SubscriptionSettings'

/**
 * A subscription managed by the event bridge
 */
export type Subscription<PayloadType = unknown, ParameterType = unknown> = {
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
  eventName?: string // event to listen for
  emitEventName?: string // event to emit if output payload is set
  principalId?: PrincipalId
  instanceId?: InstanceId
  payload?: {
    parameter?: ParameterType
    payload?: PayloadType
  }
  subscriber: EBMessageAddress
  settings: SubscriptionSettings
}
