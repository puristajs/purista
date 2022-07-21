import { EBMessageAddress } from '../types'

export const getCommandQueueName = (address: EBMessageAddress): string => {
  return `cq-${address.serviceName}-${address.serviceVersion}-${address.serviceTarget}`.toLocaleLowerCase()
}
