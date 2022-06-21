import { Service } from '../../Service'
import { EBMessage } from '../EBMessage'
import { Logger } from '../Logger'
import { SubscriptionId } from './SubscriptionId'

export type SubscriptionCallback<ServiceClassType = Service, MessageType = EBMessage> = (
  this: ServiceClassType,
  log: Logger,
  subscriptionId: SubscriptionId,
  message: MessageType,
) => Promise<void>
