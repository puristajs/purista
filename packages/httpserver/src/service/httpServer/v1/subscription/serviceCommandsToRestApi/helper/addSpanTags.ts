import type { Span } from '@opentelemetry/api'
import { ATTR_HTTP_REQUEST_METHOD, ATTR_SERVER_ADDRESS, ATTR_URL_FULL } from '@opentelemetry/semantic-conventions'
import type { FastifyRequest } from 'fastify'

export const addSpanTags = (span: Span, request: FastifyRequest) => {
	span.setAttribute(ATTR_URL_FULL, request.url)
	span.setAttribute(ATTR_HTTP_REQUEST_METHOD, request.method)
	span.setAttribute(ATTR_SERVER_ADDRESS, request.hostname)
}
