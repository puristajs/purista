import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'
/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 *
 * @group Subscription
 */
export type SubscriptionFunction<
  ServiceClassType extends ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = undefined,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = undefined,
  Invokes = {},
> = (
  this: ServiceClassType,
  context: SubscriptionFunctionContext<Invokes>,
  payload: Readonly<FunctionPayloadType>,
  parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionResultType>
