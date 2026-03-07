import type { Schema } from '../../../schema/index.js'
import type { AgentInvokeList } from '../agent/AgentInvokeList.js'
import type { ContextBase } from '../ContextBase.js'
import type { EBMessage } from '../EBMessage.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { Prettify } from '../Prettify.js'
import type { QueueContext } from '../queue/QueueContext.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'

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
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	AgentInvokes extends AgentInvokeList = EmptyObject,
> = {
	/** the original message */
	message: Readonly<EBMessage>
	/** emit a custom message */
	emit: EmitCustomMessageFunction<EmitList>
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
	/** consumes stream responses from other service stream endpoints */
	stream: StreamInvokes
	queue: QueueContext<QueueInvokes>
	/**
	 * Provides resources defined in service builder and set via config during service creation
	 */
	resources: Resources
	/**
	 * Invokes an agent and returns the result.
	 */
	invokeAgent: AgentInvokes
}

/**
 * The subscription function context which will be passed into subscription function.
 *
 * @group Subscription
 */
export type SubscriptionFunctionContext<
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	AgentInvokes extends AgentInvokeList = EmptyObject,
> = Prettify<
	ContextBase &
		SubscriptionFunctionContextEnhancements<Resources, Invokes, StreamInvokes, EmitList, QueueInvokes, AgentInvokes>
>
