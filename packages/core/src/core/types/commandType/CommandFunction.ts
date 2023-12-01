import type { ServiceClass } from '../ServiceClass'
import type { CommandFunctionContext } from './CommandFunctionContext'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 *
 * @group Command
 */
export type CommandFunction<
  ServiceClassType extends ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = unknown,
> = (
  /** the service class */
  this: ServiceClassType,
  /** the command function contest */
  context: CommandFunctionContext<MessagePayloadType, MessageParamsType>,
  /** the transformed and validated payload */
  payload: Readonly<FunctionPayloadType>,
  /** the transformed and validated parameter object */
  parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionResultType>
