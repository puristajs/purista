import type { EBMessageAddress } from '@purista/core'

export const getSubscriptionQueueName = (address: EBMessageAddress, prefix?: string): string => {
	let pre = ''
	if (prefix?.length) {
		pre = prefix.endsWith('.') ? prefix : `${prefix}.`
	}

	return `${pre}sub.${address.serviceName}.${address.serviceVersion}.${address.serviceTarget}`
}
