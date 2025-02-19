import type { EmptyObject, Service } from '../../index.js'
import type { CommandTransformFunctionContext } from './CommandTransformFunctionContext.js'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 *
 * @group Command
 *
 * @param context the Context
 * @param input The output result output of command function
 * @param params The parameter input given to command function
 * @returns The transformed message payload
 */
export type CommandTransformOutputHook<
	S extends Service,
	MessagePayloadType,
	MessageParamsType,
	FinalFunctionOutputType,
	FunctionParamsType,
	TransformOutputHookOutput,
	Resources extends Record<string, any> = EmptyObject,
> = (
	this: S,
	context: CommandTransformFunctionContext<MessagePayloadType, MessageParamsType, Resources>,
	input: Readonly<FinalFunctionOutputType>,
	params: Readonly<FunctionParamsType>,
) => Promise<TransformOutputHookOutput>
