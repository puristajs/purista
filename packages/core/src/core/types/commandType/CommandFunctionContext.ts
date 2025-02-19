import type { Schema } from '@typeschema/main'
import type { ContextBase } from '../ContextBase.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { Prettify } from '../Prettify.js'
import type { EmptyObject, InvokeList } from '../index.js'
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
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
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
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = Prettify<
	ContextBase & CommandFunctionContextEnhancements<MessagePayloadType, MessageParamsType, Resources, Invokes, EmitList>
>
