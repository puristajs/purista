import type { Complete } from '../core'
import type { DefaultEventBridgeConfig } from './types'

export const getDefaultEventBridgeConfig = (): Complete<DefaultEventBridgeConfig> => {
  const defaultConfig: Complete<DefaultEventBridgeConfig> = {
    logWarnOnMessagesWithoutReceiver: true,
    emitMessagesAsEventBridgeEvents: false,
  }

  return defaultConfig
}
