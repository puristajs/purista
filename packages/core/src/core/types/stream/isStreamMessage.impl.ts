import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import type { StreamMessage } from './StreamMessage.js'

export const isStreamMessage = (message: EBMessage): message is StreamMessage => {
	return message.messageType === EBMessageType.Stream
}
