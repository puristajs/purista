import { CommandTransformFunctionContext } from './CommandTransformFunctionContext'

export type CommandTransformInputHook<
  ServiceClassType,
  PayloadOutput = unknown,
  ParamsOutput = unknown,
  PayloadInput = unknown,
  ParamsInput = unknown,
> = (
  this: ServiceClassType,
  context: CommandTransformFunctionContext<PayloadInput, ParamsInput>,
  payload: Readonly<PayloadInput>,
  parameter: Readonly<ParamsInput>,
) => Promise<{
  payload: Readonly<PayloadOutput>
  parameter: Readonly<ParamsOutput>
}>
