import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger, LogLevelName, Prettify } from '../../types'

/**
 * The config object for an event bridge.
 * Every event bridge implementation must use this type for configuration.
 *
 */
export type EventBridgeConfig<CustomConfig> = Prettify<
  {
    /** A logger instance */
    logger?: Logger
    /**
     * If no logger instance is given, use this log level
     */
    logLevel?: LogLevelName
    /** A OpenTelemetry span processor */
    spanProcessor?: SpanProcessor | undefined
    /** The instance id of the event bridge.
     * If not set, a id will generated each time a instance is created.
     * Use this if there is a need to always have the same instance id.
     * */
    instanceId?: string
    /** Overwrite the hardcoded default timeout of command invocations */
    defaultCommandTimeout?: number
  } & CustomConfig
>
