import { Service } from '../../Service'
import { EBMessage } from '../EBMessage'
import { Logger } from '../Logger'
import { SubscriptionId } from './SubscriptionId'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type SubscriptionFunction<ServiceClassType = Service> = (
  this: ServiceClassType,
  log: Logger,
  message: EBMessage,
  subscriptionId: SubscriptionId,
) => Promise<void>
