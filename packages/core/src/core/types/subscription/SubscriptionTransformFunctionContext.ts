import { ContextBase } from '../ContextBase'
import { EBMessage } from '../EBMessage'

/**
 * @group Subscription
 */
export type SubscriptionTransformFunctionContext = ContextBase & {
  /** the original received message */
  message: Readonly<EBMessage>
}
