import type { Logger } from '../Logger'
import type { Command } from './Command'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 */

export type CommandTransformOutputHook<
  ServiceClassType,
  MessagePayloadType,
  MessageResultType,
  MessageParamsType,
  ResponseOutput = unknown,
> = (
  this: ServiceClassType,
  context: { logger: Logger; message: Readonly<Command<MessagePayloadType, MessageParamsType>> },
  payload: Readonly<MessageResultType>,
  parameter: Readonly<MessageParamsType>,
) => Promise<ResponseOutput>
