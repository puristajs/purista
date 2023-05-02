import { ContextBase } from '../ContextBase'
import { EBMessage } from '../EBMessage'
import { Prettify } from '../Prettify'

/**
 * @group Subscription
 */
export type SubscriptionTransformFunctionContext = Prettify<
  ContextBase & {
    /** the original received message */
    message: Readonly<EBMessage>
  }
>
