import type { ContextBase } from '../ContextBase'
import type { Prettify } from '../Prettify'
import type { Command } from './Command'

/**
 * @group Command
 */
export type CommandTransformFunctionContext<PayloadType, ParameterType> = Prettify<
  ContextBase & {
    /** the original message */
    message: Readonly<Command<PayloadType, ParameterType>>
  }
>
