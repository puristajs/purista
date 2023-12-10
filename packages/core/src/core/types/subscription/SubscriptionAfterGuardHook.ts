import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 *
 * @group Subscription
 */
export type SubscriptionAfterGuardHook<
  ServiceClassType = ServiceClass,
  FunctionResultType = unknown,
  FunctionPayloadOutputType = unknown,
  FunctionParameterType = unknown,
> = (
  this: ServiceClassType,
  context: SubscriptionFunctionContext,
  result: Readonly<FunctionResultType>,
  payload: Readonly<FunctionPayloadOutputType>,
  parameter: Readonly<FunctionParameterType>,
) => Promise<void>
