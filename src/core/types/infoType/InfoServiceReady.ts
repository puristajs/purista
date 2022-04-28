import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceReady = {
  messageType: EBMessageType.InfoServiceReady
} & InfoServiceBase
