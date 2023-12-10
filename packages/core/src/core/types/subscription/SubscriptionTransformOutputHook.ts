import type { SubscriptionTransformFunctionContext } from './SubscriptionTransformFunctionContext.js'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 *
 * @group Subscription
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
