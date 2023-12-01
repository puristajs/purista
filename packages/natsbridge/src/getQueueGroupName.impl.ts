import type { EBMessageAddress } from '@purista/core'

export const getQueueGroupName = (prefix: string, address: EBMessageAddress) =>
  `${prefix}_queue_${address.serviceName}_${address.serviceVersion}_${address.serviceTarget}`.toUpperCase()
