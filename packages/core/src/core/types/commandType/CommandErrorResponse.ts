import type { CorrelationId } from '../CorrelationId'
import type { EBMessageBase } from '../EBMessageBase'
import type { EBMessageSenderAddress } from '../EBMessageSenderAddress'
import type { EBMessageType } from '../EBMessageType.enum'
import type { Prettify } from '../Prettify'
import type { StatusCode } from '../StatusCode.enum'

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
