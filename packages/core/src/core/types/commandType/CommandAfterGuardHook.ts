import type { Schema } from '@typeschema/main'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { CommandFunctionContext } from './CommandFunctionContext.js'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 *
 * @group Command
 */
export type CommandAfterGuardHook<
	S extends ServiceClass = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	FunctionOutputType = unknown,
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: S,
	context: CommandFunctionContext<MessagePayloadType, MessageParamsType, Resources, Invokes, EmitList>,
	result: Readonly<FunctionOutputType>,
	originalPayload: Readonly<FunctionPayloadType>,
	originalParameter: Readonly<FunctionParamsType>,
) => Promise<void>
