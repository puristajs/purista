import type { Span } from '@opentelemetry/api'
import { context, propagation, trace } from '@opentelemetry/api'
import type { FastifyReply } from 'fastify'

export const addHeaders = (span: Span, reply: FastifyReply) => {
	const headers: Record<string, string> = {}
	propagation.inject(trace.setSpan(context.active(), span), headers)
	for (const key in headers) {
		reply.header(key, headers[key])
	}
}
