import { Subscription } from '@purista/core'

export const getStreamName = (prefix: string, subscription: Subscription) =>
  `${prefix}_stream_${subscription.subscriber.serviceName}_${subscription.subscriber.serviceVersion}_${subscription.subscriber.serviceTarget}`.toUpperCase()
