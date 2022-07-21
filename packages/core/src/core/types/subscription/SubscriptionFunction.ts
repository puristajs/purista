import type { EBMessage } from '../EBMessage'
import type { ServiceClass } from '../ServiceClass'
import type { SubscriptionContext } from './SubscriptionContext'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type SubscriptionFunction<ServiceClassType = ServiceClass, MessageType = EBMessage, Payload = unknown> = (
  this: ServiceClassType,
  context: SubscriptionContext<MessageType>,
  payload: Payload,
) => Promise<void>
