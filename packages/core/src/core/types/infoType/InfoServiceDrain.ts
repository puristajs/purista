import type { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceDrain = {
  messageType: EBMessageType.InfoServiceDrain
} & InfoServiceBase
