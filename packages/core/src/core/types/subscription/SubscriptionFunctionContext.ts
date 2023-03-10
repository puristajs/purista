import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { ConfigGetterFunction, ConfigSetterFunction } from '../configStore'
import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'
import { SecretGetterFunction, SecretSetterFunction } from '../secretStore'
import { StateGetterFunction, StateSetterFunction } from '../stateStore'

/**
 * The subscription function context which will be passed into subscription function.
 */
export type SubscriptionFunctionContext = {
  /** the logger */
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
  /** wrap given function in an opentelemetry span */
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
  /** wrap given function in an opentelemetry active span */
  startActiveSpan: <F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined,
    fn: (span: Span) => Promise<F>,
  ) => Promise<F>
  getSecret: SecretGetterFunction
  setSecret: SecretSetterFunction
  getConfig: ConfigGetterFunction
  setConfig: ConfigSetterFunction
  getState: StateGetterFunction
  setState: StateSetterFunction
}
