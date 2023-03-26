import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger } from '../../types'
import { EventBridgeBaseCustomConfig } from './EventBridgeBaseCustomConfig'

/**
 * The config object for an event bridge.
 * Every event bridge implementation must use this type for configuration.
 *
 * The implementation specific configuration can be provided as type parameter and must extend the EventBridgeBaseCustomConfig
 */
export type EventBridgeConfig<CustomConfig extends EventBridgeBaseCustomConfig> = {
  config?: CustomConfig
  logger?: Logger
  spanProcessor?: SpanProcessor
}
