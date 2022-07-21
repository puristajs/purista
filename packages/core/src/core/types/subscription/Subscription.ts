import type { EBMessageAddress } from '../EBMessageAddress'
import type { EBMessageType } from '../EBMessageType.enum'

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
  subscriber: EBMessageAddress
}
