import type { CommandTransformFunctionContext } from './CommandTransformFunctionContext.js'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 * @group Command
 */
export type CommandTransformOutputHook<
  ServiceClassType,
  MessagePayloadType,
  MessageResultType,
  MessageParamsType,
  ResponseOutput = unknown,
> = (
  this: ServiceClassType,
  context: CommandTransformFunctionContext<MessagePayloadType, MessageParamsType>,
  payload: Readonly<MessageResultType>,
  parameter: Readonly<MessageParamsType>,
) => Promise<ResponseOutput>
