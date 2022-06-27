import type { EBMessage } from '../EBMessage'
import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { SubscriptionId } from './SubscriptionId'

export type SubscriptionCallback<ServiceClassType = ServiceClass, MessageType = EBMessage> = (
  this: ServiceClassType,
  log: Logger,
  subscriptionId: SubscriptionId,
  message: MessageType,
) => Promise<void>
