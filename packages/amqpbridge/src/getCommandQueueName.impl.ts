import type { EBMessageAddress } from '@purista/core/adapter'

/**
 * Builds the AMQP queue name for a command endpoint.
 */
export const getCommandQueueName = (address: EBMessageAddress, prefix?: string): string => {
	let pre = ''
	if (prefix?.length) {
		pre = prefix.endsWith('.') ? prefix : `${prefix}.`
	}

	return `${pre}cmd.${address.serviceName}.${address.serviceVersion}.${address.serviceTarget}`
}
