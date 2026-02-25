import type { QueueInvokeFunction } from '../types/queue/QueueInvokeFunction.js'
import type { QueueScheduleFunction } from '../types/queue/QueueScheduleFunction.js'
import type { QueueInvokeList } from '../types/queue/QueueInvokeList.js'
import type { QueueInvokeClientMap, QueueScheduleProxy } from '../types/queue/QueueContext.js'

export const createQueueScheduleProxy = <TQueues extends QueueInvokeList>(
	scheduleFn: QueueScheduleFunction,
	queues?: TQueues,
) => {
	const proxy = (async <Payload, Params>(
		queueName: string,
		runAt: Date | number,
		payload: Payload,
		parameter?: Params,
		options?: Parameters<QueueInvokeFunction>[3],
	) => scheduleFn(queueName, runAt, payload, parameter, options)) as QueueScheduleFunction &
		QueueScheduleProxy<QueueInvokeClientMap<TQueues>>

	for (const [queueName] of Object.entries(queues ?? {})) {
		Object.defineProperty(proxy, queueName, {
			configurable: false,
			enumerable: false,
			value: ((
				runAt: Date | number,
				payload: unknown,
				parameter?: unknown,
				options?: Parameters<QueueInvokeFunction>[3],
			) => scheduleFn(queueName, runAt, payload, parameter, options)) as QueueScheduleProxy<
				QueueInvokeClientMap<TQueues>
			>[typeof queueName],
		})
	}

	return proxy
}
