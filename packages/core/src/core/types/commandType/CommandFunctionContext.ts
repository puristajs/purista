import { Context, Span, SpanOptions } from '@opentelemetry/api'

import { ConfigGetterFunction, ConfigSetterFunction } from '../configStore'
import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'
import { SecretGetterFunction, SecretSetterFunction } from '../secretStore'
import type { Command } from './Command'

export type CommandFunctionContext<MessagePayloadType = unknown, MessageParamsType = unknown> = {
  logger: Logger
  message: Readonly<Command<MessagePayloadType, MessageParamsType>>
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
  getSecret: SecretGetterFunction
  setSecret: SecretSetterFunction
  getConfig: ConfigGetterFunction
  setConfig: ConfigSetterFunction
}
