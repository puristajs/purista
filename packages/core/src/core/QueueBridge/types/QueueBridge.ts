import type { QueueEnqueueOptions } from '../../types/queue/QueueEnqueueOptions.js'
import type { QueueLease } from '../../types/queue/QueueLease.js'
import type { QueueMessage } from '../../types/queue/QueueMessage.js'
import type { QueueMetrics } from '../../types/queue/QueueMetrics.js'
import type { QueueBridgeCapabilities } from './QueueBridgeCapabilities.js'
import type { QueueDeadLetterListOptions } from './QueueDeadLetterListOptions.js'
import type { QueueDeadLetterRedriveOptions } from './QueueDeadLetterRedriveOptions.js'
import type { QueueEnqueueResult } from './QueueEnqueueResult.js'
import type { QueueLeaseInspectionRecord } from './QueueLeaseInspectionRecord.js'
import type { QueueLeaseOptions } from './QueueLeaseOptions.js'
import type { QueueRetryRequest } from './QueueRetryRequest.js'

export interface QueueBridge {
	readonly name: string
	readonly instanceId: string
	readonly capabilities: QueueBridgeCapabilities

	start(): Promise<void>
	isReady(): Promise<boolean>
	isHealthy(): Promise<boolean>
	destroy(): Promise<void>

	enqueue(options: QueueEnqueueOptions<unknown, unknown>): Promise<QueueEnqueueResult>
	leaseNext(queueName: string, options?: QueueLeaseOptions): Promise<QueueLease | undefined>
	extendLease(queueName: string, leaseId: string, extensionMs: number): Promise<void>
	ack(queueName: string, leaseId: string): Promise<void>
	nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void>
	moveToDeadLetter(queueName: string, message: QueueMessage, reason?: string): Promise<void>
	peekDeadLetter(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueMessage[]>
	redriveDeadLetter(queueName: string, options?: QueueDeadLetterRedriveOptions): Promise<number>
	purgeDeadLetter(queueName: string): Promise<number>
	inspectLeases(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueLeaseInspectionRecord[]>
	metrics(queueName: string): Promise<QueueMetrics>
}
