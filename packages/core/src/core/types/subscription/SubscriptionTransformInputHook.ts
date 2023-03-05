import { EBMessage } from '../EBMessage'
import { Logger } from '../Logger'

export type SubscriptionTransformInputHook<
  ServiceClassType,
  PayloadOutput = unknown,
  ParamsOutput = unknown,
  PayloadInput = unknown,
  ParamsInput = unknown,
> = (
  this: ServiceClassType,
  context: { logger: Logger; message: Readonly<EBMessage> },
  payload: Readonly<PayloadInput>,
  parameter: Readonly<ParamsInput>,
) => Promise<{
  payload: Readonly<PayloadOutput>
  parameter: Readonly<ParamsOutput>
}>
