import type { ContextBase } from '../ContextBase.js'
import type { EBMessage } from '../EBMessage.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { Prettify } from '../Prettify.js'

/**
 * It provides the original command message.
 * Also, the methods:
 *
 * - `emit` which allows to emit custom events to the event bridge
 * - `invoke` which allows to call other commands
 *
 * @group Subscription
 */
export type SubscriptionFunctionContextEnhancements<
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Resources = EmptyObject,
> = {
	/** the original message */
	message: Readonly<EBMessage>
	/** emit a custom message */
	emit: EmitCustomMessageFunction<EmitListType>
	/**
	 * Invokes a command and returns the result.
	 * It is recommended to validate the result against a schema which only contains the data you actually need.
	 *
	 * @example
	 * ```typescript
	 * // define your invocation in subscription builder
	 * .canInvoke<{ response: string }>('ServiceA', '1', 'test', payloadSchema, parameterSchema)
	 * .setCommandFunction(async function (context, payload, _parameter) {
	 *    const inputPayload = { my: 'input' }
	 *    const inputParameter = { search: 'for_me' }
	 *    const result = await context.service.ServiceA[1].test(inputPayload,inputParameter)
	 * })
	 * ```
	 */
	service: Invokes
	/**
	 * Provides resources defined in service builder and set via config during service creation
	 */
	resource: Resources
}

/**
 * The subscription function context which will be passed into subscription function.
 *
 * @group Subscription
 */
export type SubscriptionFunctionContext<
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Resources = EmptyObject,
> = Prettify<ContextBase & SubscriptionFunctionContextEnhancements<Invokes, EmitListType, Resources>>
