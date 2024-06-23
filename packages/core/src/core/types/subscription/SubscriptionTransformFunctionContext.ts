import type { ContextBase } from '../ContextBase.js'
import type { EBMessage } from '../EBMessage.js'
import type { Prettify } from '../Prettify.js'

/**
 * @group Subscription
 */
export type SubscriptionTransformFunctionContext = Prettify<
	ContextBase & {
		/** the original received message */
		message: Readonly<EBMessage>
	}
>
