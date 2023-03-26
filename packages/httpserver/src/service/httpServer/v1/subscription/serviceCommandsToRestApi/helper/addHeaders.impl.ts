import { context, propagation, Span, trace } from '@opentelemetry/api'
import { FastifyReply } from 'fastify'

export const addHeaders = (span: Span, reply: FastifyReply) => {
  const headers: Record<string, string> = {}
  propagation.inject(trace.setSpan(context.active(), span), headers)
  Object.keys(headers).forEach((key) => reply.header(key, headers[key]))
}
