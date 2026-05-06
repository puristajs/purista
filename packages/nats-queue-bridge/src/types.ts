import type { ConnectionOptions } from 'nats'

export type NatsQueueBridgeOptions = {
	connectionOptions?: ConnectionOptions
	subjectPrefix?: string
	defaultLeaseTtlMs?: number
	defaultMaxAttempts?: number
	storageType?: 'file' | 'memory'
	releaseBatchSize?: number
}
