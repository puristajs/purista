import type { QueueEnqueueOptions } from './QueueEnqueueOptions.js'
import type { QueueEnqueueResult } from '../../QueueBridge/types/QueueEnqueueResult.js'

export type QueueScheduleFunction = <Payload = unknown, Params = unknown>(
	queueName: string,
	runAt: Date | number,
	payload: Payload,
	parameter?: Params,
	options?: Omit<QueueEnqueueOptions<Payload, Params>, 'queueName' | 'payload' | 'parameter' | 'delayMs'>,
) => Promise<QueueEnqueueResult>
