import type { Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { StreamFunctionContext } from './StreamFunctionContext.js'

/**
 * Guard called after stream input validation and before the stream handler runs.
 *
 * Use stream guards for short request policy checks such as auth, quota, or
 * route validation. Keep business logic in the stream handler itself.
 *
 * @group Stream
 */
export type StreamBeforeGuardHook<
	S extends ServiceClass = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = (
	this: S,
	context: StreamFunctionContext<
		MessagePayloadType,
		MessageParamsType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes
	>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
