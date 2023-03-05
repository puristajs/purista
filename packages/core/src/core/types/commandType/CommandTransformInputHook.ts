import { Logger } from '../Logger'
import { Command } from './Command'

export type CommandTransformInputHook<
  ServiceClassType,
  PayloadOutput = unknown,
  ParamsOutput = unknown,
  PayloadInput = unknown,
  ParamsInput = unknown,
> = (
  this: ServiceClassType,
  context: { logger: Logger; message: Readonly<Command<PayloadInput, ParamsInput>> },
  payload: Readonly<PayloadInput>,
  parameter: Readonly<ParamsInput>,
) => Promise<{
  payload: Readonly<PayloadOutput>
  parameter: Readonly<ParamsOutput>
}>
