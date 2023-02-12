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
  context: { logger: Logger; message: Command<PayloadInput, ParamsInput> },
  payload: PayloadInput,
  parameter: ParamsInput,
) => Promise<{
  payload: PayloadOutput
  parameter: ParamsOutput
}>
