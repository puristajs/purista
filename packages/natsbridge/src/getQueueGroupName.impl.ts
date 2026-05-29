import type { EBMessageAddress } from '@purista/core'

/**
 * Builds the NATS queue group name for a shared command/subscription address.
 *
 * Queue groups distribute messages across instances; handlers must remain
 * idempotent because delivery can be retried after consumer or process failure.
 */
export const getQueueGroupName = (prefix: string, address: EBMessageAddress) =>
	`${prefix}_queue_${address.serviceName}_${address.serviceVersion}_${address.serviceTarget}`.toUpperCase()
