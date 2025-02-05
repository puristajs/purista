import type { ContextBase } from '../ContextBase.js'
import type { Prettify } from '../Prettify.js'
import type { Command } from './Command.js'

/**
 * @group Command
 */
export type CommandTransformFunctionContext<PayloadType, ParameterType, Resources> = Prettify<
	ContextBase & {
		/** the original message */
		message: Readonly<Command<PayloadType, ParameterType>>
		resources: Resources
	}
>
