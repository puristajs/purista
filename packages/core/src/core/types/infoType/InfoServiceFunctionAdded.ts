import { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceFunctionAdded = {
  messageType: EBMessageType.InfoServiceFunctionAdded
} & InfoServiceBase
