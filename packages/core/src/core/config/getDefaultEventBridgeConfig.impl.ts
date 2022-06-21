import { EventBridgeConfig } from '../types'

export const getDefaultEventBridgeConfig = (): EventBridgeConfig => {
  const defaultConfig: EventBridgeConfig = {
    defaultTtl: 2000,
  }

  return defaultConfig
}
