import { EBMessage } from '../EBMessage'
import { InfoMessage, infoMessageTypes } from './InfoMessage'

export const isInfoMessage = (message: EBMessage): message is InfoMessage => {
  return infoMessageTypes.includes(message.messageType)
}
