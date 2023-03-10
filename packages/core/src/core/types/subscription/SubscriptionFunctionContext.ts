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
  /** wrap given function in an opentelemetry span */
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
  /** wrap given function in an opentelemetry active span */
  startActiveSpan: <F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined,
    fn: (span: Span) => Promise<F>,
  ) => Promise<F>
  /** get a secret from the secret store */
  getSecret: SecretGetterFunction
  /** set a secret in the secret store */
  setSecret: SecretSetterFunction
  /** get a config value from the config store */
  getConfig: ConfigGetterFunction
  /** set a config value in the config store */
  setConfig: ConfigSetterFunction
  /** get a state value from the state store */
  getState: StateGetterFunction
  /** set a state value in the state store */
  setState: StateSetterFunction
}
