import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger } from '../../types'

/**
 * The config object for an event bridge.
 * Every event bridge implementation must use this type for configuration.
 *
 */
export type EventBridgeConfig<CustomConfig> = {
  config?: CustomConfig
  logger?: Logger
  spanProcessor?: SpanProcessor
  /** the instance id of the event bridge */
  instanceId?: string
  /** the default timeout of command invocations */
  defaultCommandTimeout?: number
}
