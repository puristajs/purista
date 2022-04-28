import { Service } from '../../Service'
import { EBMessage } from '../EBMessage'
import { SubscriptionId } from './SubscriptionId'

export type SubscriptionCallback<ServiceClassType = Service, MessageType = EBMessage> = (
  this: ServiceClassType,
  subscriptionId: SubscriptionId,
  message: MessageType,
) => Promise<void>
