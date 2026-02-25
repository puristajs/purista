import type { QueueInvokeFunction } from '../types/queue/QueueInvokeFunction.js'
import type { QueueInvokeList } from '../types/queue/QueueInvokeList.js'
import type { QueueEnqueueResult } from '../QueueBridge/types/QueueEnqueueResult.js'
import type { QueueEnqueueOptions } from '../types/queue/QueueEnqueueOptions.js'
import type { QueueInvokeClientMap } from '../types/queue/QueueContext.js'

const noop = () => {
	// noop
}

export const createQueueEnqueueProxy = <TQueues extends QueueInvokeList>(
	enqueueFn: QueueInvokeFunction,
	queues?: TQueues,
): QueueInvokeFunction & QueueInvokeClientMap<TQueues> => {
	const proxy = (async <Payload, Params>(
		queueName: string,
		payload: Payload,
		parameter?: Params,
		options?: Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter'>,
	): Promise<QueueEnqueueResult> => enqueueFn(queueName, payload, parameter, options)) as QueueInvokeFunction &
		QueueInvokeClientMap<TQueues>

	for (const [queueName] of Object.entries(queues ?? {})) {
		Object.defineProperty(proxy, queueName, {
			configurable: false,
			enumerable: false,
			value: (
				payload: Parameters<QueueInvokeFunction>[1],
				parameter?: Parameters<QueueInvokeFunction>[2],
				options?: Parameters<QueueInvokeFunction>[3],
			) => enqueueFn(queueName, payload, parameter, options),
		})
	}

	return proxy
}
