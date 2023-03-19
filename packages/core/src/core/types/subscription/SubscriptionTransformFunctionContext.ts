import { ContextBase } from '../ContextBase'
import { EBMessage } from '../EBMessage'
import { Logger } from '../Logger'

export type SubscriptionTransformFunctionContext = ContextBase & {
  /** the logger instance */
  logger: Logger
  /** the original received message */
  message: Readonly<EBMessage>
}
