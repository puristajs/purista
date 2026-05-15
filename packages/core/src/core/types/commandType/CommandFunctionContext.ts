import type { Schema } from '../../../schema/index.js'
import type { ContextBase } from '../ContextBase.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { Prettify } from '../Prettify.js'
import type { PuristaMetricContextProperty, PuristaMetricDefinitions } from '../PuristaMetrics.js'
import type { QueueContext } from '../queue/QueueContext.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'

import type { Command } from './Command.js'

/**
 * It provides the original command message with types for payload and parameter.
 * Also, the methods:
 *
 * - `emit` which allows to emit custom events to the event bridge
 * - `invoke` which allows to call other commands
 *
 * @group Command
 */
export type CommandFunctionContextEnhancements<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = {
	/** the original message */
	message: Readonly<Command<MessagePayloadType, MessageParamsType>>
	/** emit a custom message */
	emit: EmitCustomMessageFunction<EmitList>
	/**
	 * Invokes a command and returns the result.
	 * It is recommended to validate the result against a schema which only contains the data you actually need.
	 *
	 * @example
	 * ```typescript
	 * // define your invocation in command builder
	 * .canInvoke('ServiceA', '1', 'test', responseOutputSchema, payloadSchema, parameterSchema)
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
	/** typed queue enqueue helpers */
	queue: QueueContext<QueueInvokes>
	/**
	 * Provides resources defined in service builder and set via config during service creation
	 */
	resources: Resources
}

/**
 * The command function context which will be passed into command function.
 *
 * @group Command
 */
export type CommandFunctionContext<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = Prettify<
	ContextBase<Metrics> &
		PuristaMetricContextProperty<Metrics> &
		CommandFunctionContextEnhancements<
			MessagePayloadType,
			MessageParamsType,
			Resources,
			Invokes,
			StreamInvokes,
			EmitList,
			QueueInvokes
		>
>
