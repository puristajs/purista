import type { Schema } from '@typeschema/main'
import type { EmptyObject, InvokeList, Service } from '../../index.js'

import type { CommandFunctionContext } from './CommandFunctionContext.js'

/**
 * Guard is called after command function input validation and before executing the command function.
 * The guard is usefull to separate for example auth checks from business logic.
 * It should throw HandledError or return void.
 *
 * @group Command
 */
export type CommandBeforeGuardHook<
	S extends Service = Service,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: S,
	context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Resources, Invokes, EmitList>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
