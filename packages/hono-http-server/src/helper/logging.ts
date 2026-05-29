import type { SpanContext } from '@opentelemetry/api'

/**
 * Adds OpenTelemetry span identifiers to structured HTTP log fields.
 */
export function createHttpLogFields(
	fields: Record<string, unknown>,
	spanContext: SpanContext,
	customTraceId?: string,
): Record<string, unknown> {
	return {
		...fields,
		traceId: spanContext.traceId,
		spanId: spanContext.spanId,
		traceFlags: spanContext.traceFlags,
		...(customTraceId ? { customTraceId } : {}),
	}
}
