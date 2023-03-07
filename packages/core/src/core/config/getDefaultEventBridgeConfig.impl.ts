import { getNewInstanceId } from '../helper'
import { EventBridgeEnsuredDefaults } from '../types'

export const getDefaultEventBridgeConfig = (): EventBridgeEnsuredDefaults => {
  const defaultConfig: EventBridgeEnsuredDefaults = {
    defaultCommandTimeout: 30000,
    instanceId: getNewInstanceId(),
    logWarnOnMessagesWithoutReceiver: true,
  }

  return defaultConfig
}
