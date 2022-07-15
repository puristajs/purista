import type { ServiceClass } from '../ServiceClass'
import { CommandFunctionContext } from './CommandFunctionContext'

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
  context: CommandFunctionContext<MessagePayloadType, MessageParamsType>,
  payload: FunctionPayloadType,
  params: FunctionParamsType,
) => Promise<FunctionResultType>
