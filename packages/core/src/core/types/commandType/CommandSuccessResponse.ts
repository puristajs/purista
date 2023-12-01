import type { CorrelationId } from '../CorrelationId'
import type { EBMessageBase } from '../EBMessageBase'
import type { EBMessageSenderAddress } from '../EBMessageSenderAddress'
import type { EBMessageType } from '../EBMessageType.enum'
import type { Prettify } from '../Prettify'

/**
 * CommandSuccessResponse is a response to a specific previously received command.
 * It indicates that the command was executed successfully and contains the result payload
 *
 * @group Command
 */
export type CommandSuccessResponse<PayloadType = unknown> = Prettify<
  {
    messageType: EBMessageType.CommandSuccessResponse
    correlationId: CorrelationId
    receiver: EBMessageSenderAddress
    payload: PayloadType // result payload
  } & EBMessageBase
>
