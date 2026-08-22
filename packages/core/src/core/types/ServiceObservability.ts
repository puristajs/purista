import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { PuristaMetricsRecorder, PuristaMetricsRuntimeOptions } from '../metrics/types.js'
import type { ServiceInfoType } from './infoType/ServiceInfoType.js'
import type { Logger } from './Logger.js'

/** Source selected for one inherited observability value. @group Observability */
export type ObservabilityValueSource = 'component' | 'service' | 'default' | 'unsupported'

/** Immutable observability values owned by one service instance. @group Observability */
export type ServiceObservabilityContext = Readonly<{
	service: Pick<ServiceInfoType, 'serviceName' | 'serviceVersion'>
	logger: Logger
	spanProcessor?: SpanProcessor
	metrics?: PuristaMetricsRuntimeOptions
	metricsRecorder?: PuristaMetricsRecorder
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
