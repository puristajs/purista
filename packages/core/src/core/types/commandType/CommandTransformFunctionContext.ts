import { ContextBase } from '../ContextBase'
import { Logger } from '../Logger'
import { Command } from './Command'

export type CommandTransformFunctionContext<PayloadType, ParameterType> = ContextBase & {
  logger: Logger
  /** the original message */
  message: Readonly<Command<PayloadType, ParameterType>>
}
