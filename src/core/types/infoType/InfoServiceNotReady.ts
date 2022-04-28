import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceNotReady = {
  messageType: EBMessageType.InfoServiceNotReady
} & InfoServiceBase
