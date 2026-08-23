import type { EBMessageAddress } from '@purista/core/adapter'

/**
 * Builds the AMQP queue name for a subscription endpoint.
 */
export const getSubscriptionQueueName = (address: EBMessageAddress, prefix?: string): string => {
	let pre = ''
	if (prefix?.length) {
		pre = prefix.endsWith('.') ? prefix : `${prefix}.`
	}

	return `${pre}sub.${address.serviceName}.${address.serviceVersion}.${address.serviceTarget}`
}
