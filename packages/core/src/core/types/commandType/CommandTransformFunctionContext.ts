import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { Logger } from '../Logger'
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
}
