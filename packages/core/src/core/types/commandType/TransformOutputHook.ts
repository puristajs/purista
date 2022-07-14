import type { Logger } from '../Logger'
import type { Command } from './Command'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 */

export type TransformOutputHook<
  ServiceClassType,
  MessagePayloadType,
  MessageResultType,
  MessageParamsType,
  ResponseOutput = unknown,
> = (
  this: ServiceClassType,
  log: Logger,
  payload: MessageResultType,
  params: MessageParamsType,
  message: Command<MessagePayloadType, MessageParamsType>,
) => Promise<ResponseOutput>
