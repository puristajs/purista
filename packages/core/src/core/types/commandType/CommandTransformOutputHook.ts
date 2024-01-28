import type { CommandTransformFunctionContext } from './CommandTransformFunctionContext.js'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 *
 * @group Command
 *
 * @param context the Context
 * @param commandFunctionOutput The output result output of command function
 * @param commandFunctionInputParameter The parameter input given to command function
 * @returns The transformed message payload
 */
export type CommandTransformOutputHook<
  ServiceClassType,
  MessagePayloadType,
  MessageParamsType,
  MessageResultType,
  FunctionResultType,
  FunctionParamsType,
> = (
  this: ServiceClassType,
  context: CommandTransformFunctionContext<MessagePayloadType, MessageParamsType>,
  commandFunctionOutput: Readonly<FunctionResultType>,
  commandFunctionInputParameter: Readonly<FunctionParamsType>,
) => Promise<MessageResultType>
