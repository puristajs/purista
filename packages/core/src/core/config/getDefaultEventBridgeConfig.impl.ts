import { getNewInstanceId } from '../helper'
import { EventBridgeEnsuredDefaults } from '../types'

export const getDefaultEventBridgeConfig = (): EventBridgeEnsuredDefaults => {
  const defaultConfig: EventBridgeEnsuredDefaults = {
    defaultTtl: 30000,
    instanceId: getNewInstanceId(),
  }

  return defaultConfig
}
