import { ContextBase } from '../ContextBase'
import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'

/**
 * The subscription function context which will be passed into subscription function.
 */
export type SubscriptionFunctionContext = ContextBase & {
  /** the logger instance */
  logger: Logger
  /** the original message */
  message: Readonly<EBMessage>
  /** emit a custom message */
  emit: <Payload = unknown>(eventName: string, payload?: Payload) => Promise<void>
  /** call a other command and return the result */
  invoke: <InvokeResponseType = unknown, PayloadType = unknown, ParameterType = unknown>(
    address: EBMessageAddress,
    payload: PayloadType,
    parameter: ParameterType,
  ) => Promise<InvokeResponseType>
}
