import { CorrelationId } from '../CorrelationId'
import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import { EBMessageBase } from '../EBMessageBase'
import { EBMessageType } from '../EBMessageType.enum'

/**
 * CommandSuccessResponse is a response to a specific previously received command.
 * It indicates that the command was executed successfully and contains the result payload
 */
export type CommandSuccessResponse<PayloadType = unknown> = {
  messageType: EBMessageType.CommandSuccessResponse
  correlationId: CorrelationId
  sender: EBMessageAddress
  receiver: EBMessageAddress
  isMultipart?: boolean // multi-message handling
  response: PayloadType // result payload
} & EBMessageBase

export const isCommandSuccessResponse = (message: EBMessage): message is CommandSuccessResponse => {
  return message.messageType === EBMessageType.CommandSuccessResponse
}
