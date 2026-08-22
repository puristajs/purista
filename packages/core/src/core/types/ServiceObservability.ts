import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { PuristaMetricsRecorder, PuristaMetricsRuntimeOptions } from '../metrics/types.js'
import type { Logger } from './Logger.js'

/**
 * Observability values supplied when constructing a service.
 *
 * `ServiceBuilder.getInstance(...)` creates this context once. Compatible
 * adapters may use it before they start, but their own explicit configuration
 * always takes precedence.
 *
 * @group Observability
 */
export type ServiceObservabilityContext = Readonly<{
	/** Service logger inherited when the adapter did not configure one. */
	logger: Logger
	/** Optional span processor inherited by compatible adapters before use. */
	spanProcessor?: SpanProcessor
	/** Application-owned OpenTelemetry metrics configuration. */
	metrics?: PuristaMetricsRuntimeOptions
	/** Low-level metrics recorder override used by compatible adapters. */
	metricsRecorder?: PuristaMetricsRecorder
}>

/**
 * Optional adapter hook for safe service observability inheritance.
 *
 * Adapters must preserve explicit component configuration and must not mutate
 * runtime settings after the adapter has started or created a tracer.
 *
 * @group Observability
 */
export interface ServiceObservabilityAware {
	inheritServiceObservability(context: ServiceObservabilityContext): void
}
