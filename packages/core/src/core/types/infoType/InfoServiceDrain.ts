import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceDrain = {
  messageType: EBMessageType.InfoServiceDrain
} & InfoServiceBase
