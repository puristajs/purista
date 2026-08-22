import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { PuristaMetricsRecorder, PuristaMetricsRuntimeOptions } from '../metrics/types.js'
import type { ServiceInfoType } from './infoType/ServiceInfoType.js'
import type { Logger } from './Logger.js'

/** Source selected for one inherited observability value. @group Observability */
export type ObservabilityValueSource = 'component' | 'service' | 'default' | 'unsupported'

/**
 * Immutable observability values resolved for one service instance.
 *
 * `ServiceBuilder.getInstance(...)` creates this context once, then adapters
 * may inherit values only before they start. `sources` records whether each
 * effective value came from an explicit component setting, service wiring, or
 * a safe framework default. It never contains telemetry payloads, exporters,
 * credentials, prompts, or runtime provider instances.
 *
 * @group Observability
 */
export type ServiceObservabilityContext = Readonly<{
	/** Owning service identity added to safe adapter diagnostics. */
	service: Pick<ServiceInfoType, 'serviceName' | 'serviceVersion'>
	/** Service logger inherited only when the adapter did not configure one. */
	logger: Logger
	/** Optional span processor inherited only by compatible pre-start adapters. */
	spanProcessor?: SpanProcessor
	/** Application-owned OpenTelemetry metrics configuration. */
	metrics?: PuristaMetricsRuntimeOptions
	/** Low-level metrics recorder override used by compatible adapters. */
	metricsRecorder?: PuristaMetricsRecorder
	/** Provenance for every inheritable value. */
	sources: Readonly<{
		logger: ObservabilityValueSource
		spanProcessor: ObservabilityValueSource
		metrics: ObservabilityValueSource
	}>
}>

/** Effective sources reported by an adapter that accepts service inheritance. @group Observability */
export type ServiceObservabilityInheritance = Readonly<{
	logger: ObservabilityValueSource
	spanProcessor: ObservabilityValueSource
	metrics: ObservabilityValueSource
}>

/**
 * Effective observability sources for the infrastructure used by one service.
 *
 * This is runtime evidence, not a static architecture-manifest field: it
 * describes the actual adapter instances passed to `getInstance(...)` and
 * never contains provider objects, credentials, payloads, or telemetry data.
 *
 * @group Observability
 */
export type ServiceObservabilityReport = Readonly<{
	eventBridge: ServiceObservabilityInheritance
	stateStore: ServiceObservabilityInheritance
	secretStore: ServiceObservabilityInheritance
	configStore: ServiceObservabilityInheritance
	queueBridge: ServiceObservabilityInheritance
}>

/**
 * Optional adapter hook for safe, pre-start service observability inheritance.
 *
 * Adapters must preserve explicit component configuration and return
 * `unsupported` rather than mutating an already-started telemetry pipeline.
 *
 * @group Observability
 */
export interface ServiceObservabilityAware {
	inheritServiceObservability(context: ServiceObservabilityContext): ServiceObservabilityInheritance
}
