import { EventBridgeBaseCustomConfig } from '../../core'

/**
 * The configuration for the DefaultEventBridge.
 */
export type DefaultEventBridgeConfig = EventBridgeBaseCustomConfig & {
  /** Log warnings on messages which are emitted, but could not delivered to at least one receiver */
  logWarnOnMessagesWithoutReceiver?: boolean
}
