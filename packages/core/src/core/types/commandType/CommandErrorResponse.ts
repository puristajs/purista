import type { CorrelationId } from '../CorrelationId'
import type { EBMessageAddress } from '../EBMessageAddress'
import type { EBMessageBase } from '../EBMessageBase'
import { EBMessageType } from '../EBMessageType.enum'
import type { StatusCode } from '../StatusCode.enum'

/**
 * CommandErrorResponse is a response to a specific previously received command which indicates some failure.
 *
 * @group Command
 */
export type CommandErrorResponse = {
  messageType: EBMessageType.CommandErrorResponse
  contentType: 'application/json'
  contentEncoding: 'utf-8'
  isHandledError: boolean
  correlationId: CorrelationId
  sender: EBMessageAddress
  receiver: EBMessageAddress
  payload: {
    status: StatusCode
    message: string
    data?: unknown
  }
} & EBMessageBase
