import type { Complete } from '../core/index.js'
import type { DefaultEventBridgeConfig } from './types/index.js'

export const getDefaultEventBridgeConfig = (): Complete<DefaultEventBridgeConfig> => {
  const defaultConfig: Complete<DefaultEventBridgeConfig> = {
    logWarnOnMessagesWithoutReceiver: true,
    emitMessagesAsEventBridgeEvents: false,
  }

  return defaultConfig
}
