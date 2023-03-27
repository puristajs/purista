import { Complete } from '../core'
import { DefaultEventBridgeConfig } from './types'

export const getDefaultEventBridgeConfig = (): Complete<DefaultEventBridgeConfig> => {
  const defaultConfig: Complete<DefaultEventBridgeConfig> = {
    logWarnOnMessagesWithoutReceiver: true,
  }

  return defaultConfig
}
