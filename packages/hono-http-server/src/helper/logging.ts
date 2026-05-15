import type { SpanContext } from '@opentelemetry/api'

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
