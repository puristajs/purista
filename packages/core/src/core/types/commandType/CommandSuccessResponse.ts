import type { CorrelationId } from '../CorrelationId.js'
import type { EBMessageBase } from '../EBMessageBase.js'
import type { EBMessageSenderAddress } from '../EBMessageSenderAddress.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { Prettify } from '../Prettify.js'

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
