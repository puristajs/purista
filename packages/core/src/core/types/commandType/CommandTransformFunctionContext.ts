import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { ConfigGetterFunction, ConfigSetterFunction } from '../configStore'
import { Logger } from '../Logger'
import { SecretGetterFunction, SecretSetterFunction } from '../secretStore'
import { StateGetterFunction, StateSetterFunction } from '../stateStore'
import { Command } from './Command'

export type CommandTransformFunctionContext<PayloadType, ParameterType> = {
  logger: Logger
  message: Readonly<Command<PayloadType, ParameterType>>
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
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
