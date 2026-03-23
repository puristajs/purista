import type { Schema } from '../../../schema/index.js'
import type { AgentInvokeList } from '../agent/AgentInvokeList.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { StreamFunctionContext } from './StreamFunctionContext.js'

/**
 * Guard called after a stream completes successfully and the final payload has
 * been validated.
 *
 * `result` is the final payload written via `writer.close(...)`, or the
 * aggregated final payload when chunk aggregation is enabled.
 *
 * @group Stream
 */
export type StreamAfterGuardHook<
	S extends ServiceClass = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	FunctionFinalType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	AgentInvokes extends AgentInvokeList = EmptyObject,
> = (
	this: S,
	context: StreamFunctionContext<
		MessagePayloadType,
		MessageParamsType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes,
		AgentInvokes
	>,
	result: Readonly<FunctionFinalType>,
	originalPayload: Readonly<FunctionPayloadType>,
	originalParameter: Readonly<FunctionParamsType>,
) => Promise<void>
