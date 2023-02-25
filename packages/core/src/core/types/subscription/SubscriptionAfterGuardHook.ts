import type { ServiceClass } from '../ServiceClass'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 */
export type SubscriptionAfterGuardHook<
  ServiceClassType = ServiceClass,
  FunctionPayloadOutputType = unknown,
  FunctionParameterType = unknown,
> = (
  this: ServiceClassType,
  context: SubscriptionFunctionContext,
  payload: FunctionPayloadOutputType,
  parameter: FunctionParameterType,
) => Promise<void>
