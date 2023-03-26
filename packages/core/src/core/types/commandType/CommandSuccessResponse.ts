import type { CorrelationId } from '../CorrelationId'
import type { EBMessageAddress } from '../EBMessageAddress'
import type { EBMessageBase } from '../EBMessageBase'
import { EBMessageType } from '../EBMessageType.enum'

/**
 * CommandSuccessResponse is a response to a specific previously received command.
 * It indicates that the command was executed successfully and contains the result payload
 *
 * @group Command
 */
export type CommandSuccessResponse<PayloadType = unknown> = {
  messageType: EBMessageType.CommandSuccessResponse
  correlationId: CorrelationId
  sender: EBMessageAddress
  receiver: EBMessageAddress
  payload: PayloadType // result payload
} & EBMessageBase
