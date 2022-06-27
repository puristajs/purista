import type { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceReady = {
  messageType: EBMessageType.InfoServiceReady
} & InfoServiceBase
