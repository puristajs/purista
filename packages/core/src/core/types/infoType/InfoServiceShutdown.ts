import type { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceShutdown = {
  messageType: EBMessageType.InfoServiceShutdown
} & InfoServiceBase
