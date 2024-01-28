import type { ServiceClass } from '../ServiceClass.js'
import type { CommandFunctionContext } from './CommandFunctionContext.js'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 *
 * @group Command
 */
export type CommandAfterGuardHook<
  ServiceClassType = ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  FunctionResultType = unknown,
  FunctionPayloadType = unknown,
  FunctionParamsType = unknown,
  Invokes = {},
  EmitListType = {},
> = (
  this: ServiceClassType,
  context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Invokes, EmitListType>,
  result: Readonly<FunctionResultType>,
  input: Readonly<FunctionPayloadType>,
  parameter: Readonly<FunctionParamsType>,
) => Promise<void>
