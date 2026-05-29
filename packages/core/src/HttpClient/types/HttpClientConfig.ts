import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { PuristaMetricsRecorder } from '../../core/metrics/types.js'
import type { Logger } from '../../core/types/Logger.js'
import type { LogLevelName } from '../../core/types/LogLevelName.js'
import type { Prettify } from '../../core/types/Prettify.js'

/**
 * Basic configuration for {@link HttpClient}.
 *
 * The client emits OpenTelemetry spans and framework HTTP metrics when a
 * recorder/processor is supplied. Keep `baseUrl`, headers, and trace ids free
 * of secrets because external telemetry/log processors may observe them.
 */
export type HttpClientConfig<CustomConfig extends Record<string, unknown>> = Prettify<
	{
		/**
		 * the base url to be used
		 * @example
		 * ```typescript
		 * const config = {
		 *   baseUrl: 'http://localhost/api`
		 * }
		 * // each request will be below http://localhost/api
		 * // get('v1/orders') will call http://localhost/api/v1/orders
		 * ```
		 * */
		baseUrl?: string
		/**
		 * A logger instance
		 */
		logger?: Logger
		/**
		 * the loglevel if no logger instance is given
		 */
		logLevel?: LogLevelName
		/**
		 * If set to false, the HTTP client will not reuse the same connection for multiple requests.
		 * Default is true.
		 */
		isKeepAlive?: boolean
		/**
		 * Name of the client
		 */
		name?: string
		/**
		 * Add your default headers here.
		 *
		 * These headers will be part of every request.
		 * They can be overwritten per request option
		 * Do not put secrets here unless the application's logging and telemetry
		 * policy explicitly permits those header names.
		 * */
		defaultHeaders?: Record<string, string>
		/**
		 * set global timeout for requests in ms
		 * @default 30000
		 */
		defaultTimeout?: number
		/**
		 * Basic-Auth information
		 */
		basicAuth?: {
			/** Basic-Auth username */
			username: string
			/** Basic-Auth password */
			password: string
		}
		/** Auth-Bearer token. Prefer `setBearerToken` when rotating at runtime. */
		bearerToken?: string

		/**
		 * Opentelemetry span processor
		 */
		spanProcessor?: SpanProcessor
		/** Optional metrics recorder for HTTP client framework metrics. */
		metricsRecorder?: PuristaMetricsRecorder
		/**
		 * enable Opentelemetry tracing.
		 * The client will be handled as own resource.
		 */
		enableOpentelemetry?: boolean
		/** Custom trace Id */
		traceId?: string
	} & CustomConfig
>
