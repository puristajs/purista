import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger } from '../../types'

/**
 * The config object for an event bridge.
 * Every event bridge implementation must use this type for configuration.
 *
 */
export type EventBridgeConfig<CustomConfig> = {
  /** Specific configuration settings for the event bridge depending on the used message broker */
  config?: CustomConfig
  /** A logger instance */
  logger?: Logger
  /** A OpenTelemetry span processor */
  spanProcessor?: SpanProcessor
  /** The instance id of the event bridge.
   * If not set, a id will generated each time a instance is created.
   * Use this if there is a need to always have the same instance id.
   * */
  instanceId?: string
  /** Overwrite the hardcoded default timeout of command invocations */
  defaultCommandTimeout?: number
}