import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import type { InfoServiceFunctionAdded } from './InfoServiceFunctionAdded.js'

export const isInfoServiceFunctionAdded = (message: EBMessage): message is InfoServiceFunctionAdded => {
	return message.messageType === EBMessageType.InfoServiceFunctionAdded
}
