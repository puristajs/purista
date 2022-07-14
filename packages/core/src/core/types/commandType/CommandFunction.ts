import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { Command } from './Command'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type CommandFunction<
  ServiceClassType = ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = unknown,
> = (
  this: ServiceClassType,
  log: Logger,
  payload: FunctionPayloadType,
  params: FunctionParamsType,
  message: Command<MessagePayloadType, MessageParamsType>,
) => Promise<FunctionResultType>
