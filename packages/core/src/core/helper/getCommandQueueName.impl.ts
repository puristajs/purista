import type { EBMessageAddress } from '../types/index.js'

/**
 *
 * @param address
 * @returns
 *
 * @group Event bridge
 */
export const getCommandQueueName = (address: EBMessageAddress): string => {
	return `cq-${address.serviceName}-${address.serviceVersion}-${address.serviceTarget}`.toLocaleLowerCase()
}
