import type { EBMessage } from '../EBMessage'
import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { SubscriptionId } from './SubscriptionId'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type SubscriptionFunction<ServiceClassType = ServiceClass> = (
  this: ServiceClassType,
  log: Logger,
  message: EBMessage,
  subscriptionId: SubscriptionId,
) => Promise<void>
