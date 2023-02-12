import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'

export type SubscriptionContext<MessageType = EBMessage> = {
  logger: Logger
  message: MessageType
  emit: <Payload = unknown>(eventName: string, payload?: Payload) => Promise<void>
  invoke: <InvokeResponseType = unknown, PayloadType = unknown, ParameterType = unknown>(
    address: EBMessageAddress,
    payload: PayloadType,
    parameter: ParameterType,
  ) => Promise<InvokeResponseType>
  wrapInSpan: <F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context) => Promise<F>
  startActiveSpan: <F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined,
    fn: (span: Span) => Promise<F>,
  ) => Promise<F>
}
