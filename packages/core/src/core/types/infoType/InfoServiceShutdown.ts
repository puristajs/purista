import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceShutdown = {
  messageType: EBMessageType.InfoServiceShutdown
} & InfoServiceBase
