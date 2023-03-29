import { SubscriptionTransformFunctionContext } from './SubscriptionTransformFunctionContext'

export type SubscriptionTransformInputHook<
  ServiceClassType,
  PayloadOutput = unknown,
  ParamsOutput = unknown,
  PayloadInput = unknown,
  ParamsInput = unknown,
> = (
  this: ServiceClassType,
  context: SubscriptionTransformFunctionContext,
  payload: Readonly<PayloadInput>,
  parameter: Readonly<ParamsInput>,
) => Promise<{
  payload: Readonly<PayloadOutput>
  parameter: Readonly<ParamsOutput>
}>
