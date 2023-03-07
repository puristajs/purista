import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { EBMessage } from '../EBMessage'
import { Logger } from '../Logger'

export type SubscriptionTransformFunctionContext = {
  logger: Logger
  message: Readonly<EBMessage>
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
  startActiveSpan: <F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined,
    fn: (span: Span) => Promise<F>,
  ) => Promise<F>
}
