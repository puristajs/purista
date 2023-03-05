import type { ServiceClass } from '../ServiceClass'
import { CommandFunctionContext } from './CommandFunctionContext'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type CommandFunction<
  ServiceClassType extends ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = unknown,
> = (
  this: ServiceClassType,
  context: CommandFunctionContext<MessagePayloadType, MessageParamsType>,
  payload: Readonly<FunctionPayloadType>,
  parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionResultType>
