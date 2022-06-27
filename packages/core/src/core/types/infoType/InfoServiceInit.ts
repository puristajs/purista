import type { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceInit = {
  messageType: EBMessageType.InfoServiceInit
} & InfoServiceBase
