import type { InferIn, Schema } from '../../../schema/index.js'
import type { QueueEnqueueResult } from '../../QueueBridge/types/QueueEnqueueResult.js'
import type { QueueInvokeFunction } from './QueueInvokeFunction.js'
import type { QueueInvokeList } from './QueueInvokeList.js'
import type { QueueScheduleFunction } from './QueueScheduleFunction.js'
import type { QueueEnqueueOptions } from './QueueEnqueueOptions.js'

type InferPayload<S> = S extends Schema ? InferIn<S> : unknown
type InferParameter<S> = S extends Schema ? InferIn<S> : unknown

export type QueueInvokeClientMap<TQueues extends QueueInvokeList> = {
	[K in keyof TQueues]: (
		payload: InferPayload<TQueues[K]['payloadSchema']>,
		parameter?: InferParameter<TQueues[K]['parameterSchema']>,
		options?: Omit<
			QueueEnqueueOptions<InferPayload<TQueues[K]['payloadSchema']>, InferParameter<TQueues[K]['parameterSchema']>>,
			'queueName' | 'payload' | 'parameter'
		>,
	) => Promise<QueueEnqueueResult>
}

export type QueueScheduleProxy<
	TQueues extends Record<string, (...args: any[]) => Promise<QueueEnqueueResult>>,
> = {
	[K in keyof TQueues]: TQueues[K] extends (
		payload: infer Payload,
		parameter?: infer Params,
		options?: infer Options,
	) => Promise<QueueEnqueueResult>
		? (
				runAt: Date | number,
				payload: Payload,
				parameter?: Params,
				options?: Options extends Record<string, unknown> ? Omit<Options, 'delayMs'> : Options,
		  ) => Promise<QueueEnqueueResult>
		: never
}

export type QueueContext<Queues extends QueueInvokeList = QueueInvokeList> = {
	enqueue: QueueInvokeFunction & QueueInvokeClientMap<Queues>
	scheduleAt: QueueScheduleFunction & QueueScheduleProxy<QueueInvokeClientMap<Queues>>
}
