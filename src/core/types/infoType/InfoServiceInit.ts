import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceInit = {
  messageType: EBMessageType.InfoServiceInit
} & InfoServiceBase
