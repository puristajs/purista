import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger, LogLevelName, Prettify } from '../../core'

/**
 * Tha basic configuration for a HTTPClient
 * Requires as least a `baseUrl`
 */
export type HttpClientConfig<CustomConfig extends Record<string, unknown>> = Prettify<
  {
    /**
     * the base url to be used
     * @example ```typescript
     * const config = {
     *   baseUrl: 'http://localhost/api`
     * }
     * // each request will be below http://localhost/api
     * // get('v1/orders') will call http://localhost/api/v1/orders
     * ```
     * */
    baseUrl: string
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
     * Add your default headers here
     * These headers will be part of every request.
     * They can be overwritten per request option
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
    /** Auth-Bearer token */
    bearerToken?: string

    /**
     * Opentelemetry span processor
     */
    spanProcessor?: SpanProcessor
    /**
     * enable Opentelemetry tracing.
     * The client will be handled as own ressource.
     */
    enableOpentelemetry?: boolean
  } & CustomConfig
>
