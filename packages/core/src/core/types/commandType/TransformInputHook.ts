import { Logger } from '../Logger'
import { Command } from './Command'

export type TransformInputHook<
  ServiceClassType,
  PayloadOutput = unknown,
  ParamsOutput = unknown,
  PayloadInput = unknown,
  ParamsInput = unknown,
> = (
  this: ServiceClassType,
  log: Logger,
  payload: PayloadInput,
  params: ParamsInput,
  message: Command<PayloadInput, ParamsInput>,
) => Promise<{
  payload: PayloadOutput
  params: ParamsOutput
}>
