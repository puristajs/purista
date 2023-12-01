import type { Span } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import type { FastifyRequest } from 'fastify'

export const addSpanTags = (span: Span, request: FastifyRequest) => {
  span.setAttribute(SemanticAttributes.HTTP_URL, request.url)
  span.setAttribute(SemanticAttributes.HTTP_METHOD, request.method)
  span.setAttribute(SemanticAttributes.HTTP_HOST, request.hostname)
}
