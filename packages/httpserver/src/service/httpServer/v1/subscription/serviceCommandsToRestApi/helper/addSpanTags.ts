import type { Span } from '@opentelemetry/api'
import { ATTR_HTTP_HOST, ATTR_HTTP_METHOD, ATTR_URL_FULL } from '@opentelemetry/semantic-conventions/incubating'
import type { FastifyRequest } from 'fastify'

export const addSpanTags = (span: Span, request: FastifyRequest) => {
	span.setAttribute(ATTR_URL_FULL, request.url)
	span.setAttribute(ATTR_HTTP_METHOD, request.method)
	span.setAttribute(ATTR_HTTP_HOST, request.hostname)
}
