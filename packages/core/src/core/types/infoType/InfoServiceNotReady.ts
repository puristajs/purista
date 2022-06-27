import type { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceNotReady = {
  messageType: EBMessageType.InfoServiceNotReady
} & InfoServiceBase
