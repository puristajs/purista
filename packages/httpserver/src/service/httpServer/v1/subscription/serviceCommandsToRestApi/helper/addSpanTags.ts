import type { Span } from '@opentelemetry/api'
import { SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_URL } from '@opentelemetry/semantic-conventions'
import type { FastifyRequest } from 'fastify'

export const addSpanTags = (span: Span, request: FastifyRequest) => {
	span.setAttribute(SEMATTRS_HTTP_URL, request.url)
	span.setAttribute(SEMATTRS_HTTP_METHOD, request.method)
	span.setAttribute(SEMATTRS_HTTP_HOST, request.hostname)
}
