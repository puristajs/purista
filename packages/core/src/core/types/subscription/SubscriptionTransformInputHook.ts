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
  context: { logger: Logger; message: EBMessage },
  payload: PayloadInput,
  parameter: ParamsInput,
) => Promise<{
  payload: PayloadOutput
  parameter: ParamsOutput
}>
