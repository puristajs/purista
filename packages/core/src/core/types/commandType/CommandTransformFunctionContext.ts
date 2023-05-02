import { ContextBase } from '../ContextBase'
import { Prettify } from '../Prettify'
import { Command } from './Command'

/**
 * @group Command
 */
export type CommandTransformFunctionContext<PayloadType, ParameterType> = Prettify<
  ContextBase & {
    /** the original message */
    message: Readonly<Command<PayloadType, ParameterType>>
  }
>
