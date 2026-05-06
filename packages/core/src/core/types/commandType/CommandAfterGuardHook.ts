import type { Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
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
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = (
	this: S,
	context: CommandFunctionContext<
		MessagePayloadType,
		MessageParamsType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes
	>,
	result: Readonly<FunctionOutputType>,
	originalPayload: Readonly<FunctionPayloadType>,
	originalParameter: Readonly<FunctionParamsType>,
) => Promise<void>
