import type { EmptyObject, Service } from '../../index.js'
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
	S extends Service,
	MessagePayloadType,
	MessageParamsType,
	TransformInputPayload,
	TransformInputParams,
	FunctionPayloadType,
	FunctionParamsType,
	Resources extends Record<string, any> = EmptyObject,
> = (
	/** the service instance */
	this: S,
	/** the transform function context */
	context: CommandTransformFunctionContext<MessagePayloadType, MessageParamsType, Resources>,
	/** the payload validated against the transform payload schema */
	payload: Readonly<TransformInputPayload>,
	/** the payload validated against the transform parameter schema */
	parameter: Readonly<TransformInputParams>,
) => Promise<{
	payload: FunctionPayloadType
	parameter: FunctionParamsType
}>
