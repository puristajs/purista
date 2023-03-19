import { ContextBase } from '../ContextBase'
import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'
import type { Command } from './Command'

/**
 * The command function context which will be passed into command function.
 */
export type CommandFunctionContext<MessagePayloadType = unknown, MessageParamsType = unknown> = ContextBase & {
  /** the logger instance */
  logger: Logger
  /** the original message */
  message: Readonly<Command<MessagePayloadType, MessageParamsType>>
  /** emit a custom message */
  emit: <Payload = unknown>(eventName: string, payload?: Payload) => Promise<void>
  /** call a other command and return the result */
  invoke: <InvokeResponseType = unknown, PayloadType = unknown, ParameterType = unknown>(
    address: EBMessageAddress,
    payload: PayloadType,
    parameter: ParameterType,
  ) => Promise<InvokeResponseType>
}
