import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import type { InfoServiceBase } from './InfoServiceBase'

export type InfoServiceFunctionAdded = {
  messageType: EBMessageType.InfoServiceFunctionAdded
} & InfoServiceBase

export const isInfoServiceFunctionAdded = (message: EBMessage): message is InfoServiceFunctionAdded => {
  return message.messageType === EBMessageType.InfoServiceFunctionAdded
}
