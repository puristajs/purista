import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { Command } from './Command'

export const isCommand = (message: EBMessage): message is Command => {
  return message.messageType === EBMessageType.Command
}
