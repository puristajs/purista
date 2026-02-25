import type { QueueMessage } from './QueueMessage.js'

export type QueueLease<Payload = unknown, Params = unknown> = {
	id: string
	queueName: string
	message: QueueMessage<Payload, Params>
	leaseId: string
	leasedAt: number
	leaseExpiresAt: number
}
