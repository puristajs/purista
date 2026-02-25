import type { QueueMetrics } from './queue/QueueMetrics.js'

export type QueueHealthStatus = 'ok' | 'warn' | 'error'

export type QueueHealthState = {
	queueName: string
	status: QueueHealthStatus
	reason?: string
	metrics: QueueMetrics
}

export type ServiceHealthStatus = 'ok' | 'warn' | 'error'

export type ServiceHealthState = {
	status: ServiceHealthStatus
	eventBridgeHealthy: boolean
	queueBridgeHealthy: boolean
	queues: QueueHealthState[]
}
