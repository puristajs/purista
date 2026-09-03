import type { HarnessInvocationClients } from '../../../HarnessMount/invocation.js'
import type { HarnessModelClients } from '../../../HarnessMount/model.js'
import type { Schema } from '../../../schema/index.js'
import type { ContextBase } from '../ContextBase.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { Prettify } from '../Prettify.js'
import type { PuristaMetricContextProperty, PuristaMetricDefinitions } from '../PuristaMetrics.js'
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
> = {
	message: Readonly<StreamOpenRequest<MessagePayloadType, MessageParamsType>>
	emit: EmitCustomMessageFunction<EmitList>
	service: Invokes
	stream: StreamInvokes
	agent: HarnessInvocationClients<Invokes, 'agent'>
	workflow: HarnessInvocationClients<Invokes, 'workflow'>
	/** Deterministic model handles explicitly declared with `canUseHarnessModel`. */
	model: HarnessModelClients<Invokes>
	queue: QueueContext<QueueInvokes>
	resources: Resources
}

export type StreamFunctionContext<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = Prettify<
	ContextBase<Metrics> &
		PuristaMetricContextProperty<Metrics> &
		StreamFunctionContextEnhancements<
			MessagePayloadType,
			MessageParamsType,
			Resources,
			Invokes,
			StreamInvokes,
			EmitList,
			QueueInvokes
		>
>
