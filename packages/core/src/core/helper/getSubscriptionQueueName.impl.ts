import { EBMessageAddress } from '../types'

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
