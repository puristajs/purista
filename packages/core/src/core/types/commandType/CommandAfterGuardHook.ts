import type { EmptyObject } from '../EmptyObject.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { CommandFunctionContext } from './CommandFunctionContext.js'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 *
 * @group Command
 */
export type CommandAfterGuardHook<
	ServiceClassType = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionResultType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Resources = EmptyObject,
> = (
	this: ServiceClassType,
	context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Invokes, EmitListType, Resources>,
	result: Readonly<FunctionResultType>,
	input: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
