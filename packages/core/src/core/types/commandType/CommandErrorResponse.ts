import { CorrelationId } from '../CorrelationId'
import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import { EBMessageBase } from '../EBMessageBase'
import { EBMessageType } from '../EBMessageType.enum'
import { StatusCode } from '../StatusCode.enum'

/**
 * CommandErrorResponse is a response to a specific previously received command which indicates some failure.
 */
export type CommandErrorResponse = {
  messageType: EBMessageType.CommandErrorResponse
  isHandledError: boolean
  correlationId: CorrelationId
  sender: EBMessageAddress
  receiver: EBMessageAddress
  response: {
    status: StatusCode
    message: string
    data?: unknown
  }
} & EBMessageBase

export const isCommandErrorResponse = (message: EBMessage | unknown): message is CommandErrorResponse => {
  if (typeof message !== 'object' || message === null) {
    return false
  }
  const m = message as CommandErrorResponse
  return m.messageType === EBMessageType.CommandErrorResponse
}
