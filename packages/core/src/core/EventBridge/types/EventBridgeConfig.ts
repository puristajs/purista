import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { PuristaMetricsRecorder, PuristaMetricsRuntimeOptions } from '../../metrics/types.js'
import type { Logger } from '../../types/Logger.js'
import type { LogLevelName } from '../../types/LogLevelName.js'
import type { Prettify } from '../../types/Prettify.js'

/**
 * The config object for an event bridge.
 * Every event bridge implementation must use this type for configuration.
 *
 */
export type EventBridgeConfig<CustomConfig> = Prettify<
	{
		logger?: Logger
		logLevel?: LogLevelName
		spanProcessor?: SpanProcessor | undefined
		metrics?: PuristaMetricsRuntimeOptions
		metricsRecorder?: PuristaMetricsRecorder
		/** The instance id of the event bridge.
		 * If not set, a id will generated each time a instance is created.
		 * Use this if there is a need to always have the same instance id.
		 * */
		instanceId?: string
		/** Overwrite the hardcoded default timeout of command invocations */
		defaultCommandTimeout?: number
	} & CustomConfig
>
