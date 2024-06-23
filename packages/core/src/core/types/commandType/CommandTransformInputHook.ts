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
	FunctionPayloadOutput = unknown,
	FunctionParamsOutput = unknown,
	MessagePayloadInput = unknown,
	MessageParamsInput = unknown,
> = (
	/** the service instance */
	this: ServiceClassType,
	/** the transform function context */
	context: CommandTransformFunctionContext<MessagePayloadInput, MessageParamsInput>,
	/** the payload validated against the transform payload schema */
	payload: Readonly<MessagePayloadInput>,
	/** the payload validated against the transform parameter schema */
	parameter: Readonly<MessageParamsInput>,
) => Promise<{
	payload: Readonly<FunctionPayloadOutput>
	parameter: Readonly<FunctionParamsOutput>
}>
