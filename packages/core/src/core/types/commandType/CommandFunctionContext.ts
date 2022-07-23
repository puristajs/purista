import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'
import type { Command } from './Command'

export type CommandFunctionContext<MessagePayloadType = unknown, MessageParamsType = unknown> = {
  logger: Logger
  message: Command<MessagePayloadType, MessageParamsType>
  emit: <Payload = unknown>(eventName: string, payload?: Payload) => Promise<void>
  invoke: <InvokeResponseType = unknown, PayloadType = unknown, ParameterType = unknown>(
    address: EBMessageAddress,
    payload: PayloadType,
    parameter: ParameterType,
  ) => Promise<InvokeResponseType>
}
