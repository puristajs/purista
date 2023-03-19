import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { ConfigDeleteFunction, ConfigGetterFunction, ConfigSetterFunction } from './configStore'
import { SecretDeleteFunction, SecretGetterFunction, SecretSetterFunction } from './secretStore'
import { StateDeleteFunction, StateGetterFunction, StateSetterFunction } from './stateStore'

export type ContextBase = {
  /** wrap given function in an opentelemetry span */
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
  /** wrap given function in an opentelemetry active span */
  startActiveSpan: <F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined,
    fn: (span: Span) => Promise<F>,
  ) => Promise<F>
  secrets: {
    /** get a secret from the secret store */
    getSecret: SecretGetterFunction
    /** set a secret in the secret store */
    setSecret: SecretSetterFunction
    /** delete a secret from the secret store */
    removeSecret: SecretDeleteFunction
  }
  configs: {
    /** get a config value from the config store */
    getConfig: ConfigGetterFunction
    /** set a config value in the config store */
    setConfig: ConfigSetterFunction
    /** delete a config value from the config store */
    removeConfig: ConfigDeleteFunction
  }
  states: {
    /** get a state value from the state store */
    getState: StateGetterFunction
    /** set a state value in the state store */
    setState: StateSetterFunction
    /** delete a state value from the state store */
    removeState: StateDeleteFunction
  }
}
