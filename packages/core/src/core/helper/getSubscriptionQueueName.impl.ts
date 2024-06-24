import type { EBMessageAddress } from '../types/index.js'

/**
 *
 * @param address
 * @returns
 *
 * @group Helper
 */
export const getSubscriptionQueueName = (address: EBMessageAddress): string => {
	return `sq-${address.serviceName}-${address.serviceVersion}-${address.serviceTarget}`.toLocaleLowerCase()
}
