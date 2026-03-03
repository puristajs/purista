import type { Schema } from '../../../schema/index.js'
import type { AgentInvokeList } from '../agent/AgentInvokeList.js'
import type { ContextBase } from '../ContextBase.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { Prettify } from '../Prettify.js'
import type { QueueContext } from '../queue/QueueContext.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { StreamOpenRequest } from './StreamOpenRequest.js'

export type StreamFunctionContextEnhancements<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	AgentInvokes extends AgentInvokeList = EmptyObject,
> = {
	message: Readonly<StreamOpenRequest<MessagePayloadType, MessageParamsType>>
	emit: EmitCustomMessageFunction<EmitList>
	service: Invokes
	stream: StreamInvokes
	queue: QueueContext<QueueInvokes>
	resources: Resources
	/**
	 * Invokes an agent and returns the result.
	 */
	invokeAgent: AgentInvokes
}

export type StreamFunctionContext<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	AgentInvokes extends AgentInvokeList = EmptyObject,
> = Prettify<
	ContextBase &
		StreamFunctionContextEnhancements<
			MessagePayloadType,
			MessageParamsType,
			Resources,
			Invokes,
			StreamInvokes,
			EmitList,
			QueueInvokes,
			AgentInvokes
		>
>
