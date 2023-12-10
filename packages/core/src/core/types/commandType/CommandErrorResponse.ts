import type { CorrelationId } from '../CorrelationId.js'
import type { EBMessageBase } from '../EBMessageBase.js'
import type { EBMessageSenderAddress } from '../EBMessageSenderAddress.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { Prettify } from '../Prettify.js'
import type { StatusCode } from '../StatusCode.enum.js'

/**
 * CommandErrorResponse is a response to a specific previously received command which indicates some failure.
 *
 * @group Command
 */
export type CommandErrorResponse = Prettify<
  {
    messageType: EBMessageType.CommandErrorResponse
    contentType: 'application/json'
    contentEncoding: 'utf-8'
    isHandledError: boolean
    correlationId: CorrelationId
    receiver: EBMessageSenderAddress
    payload: {
      status: StatusCode
      message: string
      data?: unknown
    }
  } & EBMessageBase
>
