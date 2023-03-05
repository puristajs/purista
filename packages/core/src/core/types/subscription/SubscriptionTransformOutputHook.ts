import { EBMessage } from '../EBMessage'
import type { Logger } from '../Logger'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 */

export type SubscriptionTransformOutputHook<
  ServiceClassType,
  MessageResultType = unknown,
  MessageParamsType = unknown,
  ResponseOutput = unknown,
> = (
  this: ServiceClassType,
  context: { logger: Logger; message: Readonly<EBMessage> },
  payload: Readonly<MessageResultType>,
  parameter: Readonly<MessageParamsType>,
) => Promise<ResponseOutput>
