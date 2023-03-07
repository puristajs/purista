import { SubscriptionTransformFunctionContext } from './SubscriptionTransformFunctionContext'

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
  context: SubscriptionTransformFunctionContext,
  payload: Readonly<MessageResultType>,
  parameter: Readonly<MessageParamsType>,
) => Promise<ResponseOutput>
