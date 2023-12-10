import type { CommandTransformFunctionContext } from './CommandTransformFunctionContext.js'

/**
 * The command transform gets the raw message payload and parameter input, which is validated against the transform input schemas.
 * The command transform function is called before guard hooks and before the actual command function.
 *
 * It should throw HandledError or return an object with the transformed payload and parameter.
 * The type of returned payload and parameter must match the command function input for payload and parameter
 *
 * @group Command
 */
export type CommandTransformInputHook<
  ServiceClassType,
  PayloadOutput = unknown,
  ParamsOutput = unknown,
  PayloadInput = unknown,
  ParamsInput = unknown,
> = (
  /** the service instance */
  this: ServiceClassType,
  /** the transform function context */
  context: CommandTransformFunctionContext<PayloadInput, ParamsInput>,
  /** the payload validated against the transform payload schema */
  payload: Readonly<PayloadInput>,
  /** the payload validated against the transform parameter schema */
  parameter: Readonly<ParamsInput>,
) => Promise<{
  payload: Readonly<PayloadOutput>
  parameter: Readonly<ParamsOutput>
}>
