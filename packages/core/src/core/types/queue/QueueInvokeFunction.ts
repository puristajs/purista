import type { QueueEnqueueOptions } from './QueueEnqueueOptions.js'
import type { QueueEnqueueResult } from '../../QueueBridge/types/QueueEnqueueResult.js'

export type QueueInvokeFunction = <Payload = unknown, Params = unknown>(
	queueName: string,
	payload: Payload,
	parameter?: Params,
	options?: Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter'>,
) => Promise<QueueEnqueueResult>
