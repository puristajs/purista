import type { ContextBase } from '../ContextBase.js'
import type { EBMessage } from '../EBMessage.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { Prettify } from '../Prettify.js'

/**
 * @group Subscription
 */
export type SubscriptionTransformFunctionContext<Resources extends Record<string, any> = EmptyObject> = Prettify<
	ContextBase & {
		/** the original received message */
		message: Readonly<EBMessage>
		resources: Resources
	}
>
