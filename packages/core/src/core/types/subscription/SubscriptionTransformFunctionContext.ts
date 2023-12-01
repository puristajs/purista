import type { ContextBase } from '../ContextBase'
import type { EBMessage } from '../EBMessage'
import type { Prettify } from '../Prettify'

/**
 * @group Subscription
 */
export type SubscriptionTransformFunctionContext = Prettify<
  ContextBase & {
    /** the original received message */
    message: Readonly<EBMessage>
  }
>
