import { ContextBase } from '../ContextBase'
import { Command } from './Command'

/**
 * @group Command
 */
export type CommandTransformFunctionContext<PayloadType, ParameterType> = ContextBase & {
  /** the original message */
  message: Readonly<Command<PayloadType, ParameterType>>
}
