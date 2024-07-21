import type { EmptyObject } from '../EmptyObject.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { CommandFunctionContext } from './CommandFunctionContext.js'

/**
 * Guard is called after command function input validation and before executing the command function.
 * The guard is usefull to separate for example auth checks from business logic.
 * It should throw HandledError or return void.
 *
 * @group Command
 */
export type CommandBeforeGuardHook<
	ServiceClassType = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = MessagePayloadType,
	FunctionParamsType = MessageParamsType,
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Resources = EmptyObject,
> = (
	this: ServiceClassType,
	context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Invokes, EmitListType, Resources>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
