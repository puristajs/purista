import type { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoSubscriptionError = {
  messageType: EBMessageType.InfoSubscriptionError
} & InfoServiceBase
