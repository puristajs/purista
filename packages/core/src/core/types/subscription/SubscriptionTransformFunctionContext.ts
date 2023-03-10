import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { ConfigGetterFunction, ConfigSetterFunction } from '../configStore'
import { EBMessage } from '../EBMessage'
import { Logger } from '../Logger'
import { SecretGetterFunction, SecretSetterFunction } from '../secretStore'
import { StateGetterFunction, StateSetterFunction } from '../stateStore'

export type SubscriptionTransformFunctionContext = {
  /** the logger instance */
  logger: Logger
  /** the original received message */
  message: Readonly<EBMessage>
  /** wrap a function into a opentelemetry span (flat)  */
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
  /** wrap a function into a opentelemetry span (as child in hierarchy) */
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
