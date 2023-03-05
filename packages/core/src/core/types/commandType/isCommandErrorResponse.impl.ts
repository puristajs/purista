import { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { CommandErrorResponse } from './CommandErrorResponse'

export const isCommandErrorResponse = (message: EBMessage | unknown): message is CommandErrorResponse => {
  if (typeof message !== 'object' || message === null) {
    return false
  }
  const m = message as CommandErrorResponse
  return m.messageType === EBMessageType.CommandErrorResponse
}
