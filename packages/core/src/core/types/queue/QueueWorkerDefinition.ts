import type { InferIn, Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { PuristaMetricDefinitions } from '../PuristaMetrics.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueHandlerResult } from './QueueHandlerResult.js'
import type { QueueInvokeList } from './QueueInvokeList.js'
import type { QueueJobContext } from './QueueJobContext.js'
import type { QueueMessage } from './QueueMessage.js'
import type { QueueWorkerAfterGuardHook } from './QueueWorkerAfterGuardHook.js'
import type { QueueWorkerBeforeGuardHook } from './QueueWorkerBeforeGuardHook.js'

export type QueueWorkerMode = 'continuous' | 'interval' | 'sequential'

export type QueueWorkerHandler<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = Record<string, never>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = (
	context: QueueJobContext<
		MessagePayloadType,
		MessageParamsType,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes,
		Metrics
	>,
	message: QueueMessage<MessagePayloadType, MessageParamsType>,
) => Promise<QueueHandlerResult | undefined>

export type QueueWorkerDefinition<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = Record<string, never>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	name: string
	queueName: string
	mode: QueueWorkerMode
	intervalMs?: number
	maxParallelHandlers: number
	handler: QueueWorkerHandler<
		PayloadSchema,
		ParamsSchema,
		Resources,
		Invokes,
		StreamInvokes,
		EmitList,
		QueueInvokes,
		Metrics
	>
	beforeGuards?: Record<
		string,
		QueueWorkerBeforeGuardHook<
			ServiceClass,
			InferIn<PayloadSchema>,
			InferIn<ParamsSchema>,
			Resources,
			Invokes,
			StreamInvokes
		>
	>
	afterGuards?: Record<
		string,
		QueueWorkerAfterGuardHook<
			ServiceClass,
			InferIn<PayloadSchema>,
			InferIn<ParamsSchema>,
			Resources,
			Invokes,
			StreamInvokes
		>
	>
}
