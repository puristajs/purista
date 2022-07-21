import { EBMessageAddress } from '../types'

export const getSubscriptionQueueName = (address: EBMessageAddress): string => {
  return `sq-${address.serviceName}-${address.serviceVersion}-${address.serviceTarget}`.toLocaleLowerCase()
}
