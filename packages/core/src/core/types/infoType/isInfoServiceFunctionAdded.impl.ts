import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { InfoServiceFunctionAdded } from './InfoServiceFunctionAdded'

export const isInfoServiceFunctionAdded = (message: EBMessage): message is InfoServiceFunctionAdded => {
  return message.messageType === EBMessageType.InfoServiceFunctionAdded
}
