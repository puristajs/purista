import type { ServiceClass } from '../ServiceClass.js'
import type { CommandFunctionContext } from './CommandFunctionContext.js'

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
  Invokes = {},
  EmitListType = {},
  Ressources = {},
> = (
  /** the service class */
  this: ServiceClassType,
  /** the command function contest */
  context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Invokes, EmitListType, Ressources>,
  /** the transformed and validated payload */
  payload: Readonly<FunctionPayloadType>,
  /** the transformed and validated parameter object */
  parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionResultType>
