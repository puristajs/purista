import type { ServiceClass } from '../ServiceClass'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext'
/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type SubscriptionFunction<
  ServiceClassType extends ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = undefined,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = undefined,
> = (
  this: ServiceClassType,
  context: SubscriptionFunctionContext,
  payload: Readonly<FunctionPayloadType>,
  parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionResultType>
