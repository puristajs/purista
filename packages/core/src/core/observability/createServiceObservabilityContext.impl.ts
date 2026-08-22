import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import type { PuristaMetricsRecorder, PuristaMetricsRuntimeOptions } from '../metrics/types.js'
import type { Logger } from '../types/Logger.js'
import type { LogLevelName } from '../types/LogLevelName.js'
import type { ServiceObservabilityContext } from '../types/ServiceObservability.js'

/** Flat service runtime inputs normalized into the immutable observability context. */
export type ServiceObservabilityInput = {
	logger?: Logger
	logLevel?: LogLevelName
	spanProcessor?: ServiceObservabilityContext['spanProcessor']
	metrics?: PuristaMetricsRuntimeOptions
	metricsRecorder?: PuristaMetricsRecorder
}

/**
 * Resolve the immutable observability context for one service instance.
 *
 * Runtime options are supplied through the flat `ServiceBuilder.getInstance`
 * configuration. Individual adapters retain their own explicit configuration.
 *
 * @group Observability
 */
export const createServiceObservabilityContext = (input: ServiceObservabilityInput): ServiceObservabilityContext => {
	const logger = input.logger ?? initLogger(input.logLevel)
	return Object.freeze({
		logger,
		spanProcessor: input.spanProcessor,
		metrics: input.metrics,
		metricsRecorder: input.metricsRecorder,
	})
}
