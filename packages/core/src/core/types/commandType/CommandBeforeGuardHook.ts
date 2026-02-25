import type { Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../../types/EmptyObject.js'
import type { InvokeList } from '../../types/InvokeList.js'
import type { StreamInvokeList } from '../../types/StreamInvokeList.js'

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
	S extends ServiceClass = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: S,
	context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes, EmitList>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
