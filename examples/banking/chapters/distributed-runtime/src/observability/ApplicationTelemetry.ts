import type { Meter } from '@opentelemetry/api'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'

export interface ApplicationTelemetry {
	spanProcessor: SpanProcessor
	meter: Meter
}
