import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoSubscriptionError = {
  messageType: EBMessageType.InfoSubscriptionError
} & InfoServiceBase
