import { Complete, getNewInstanceId } from '../core'
import { DefaultEventBridgeConfig } from './types'

export const getDefaultEventBridgeConfig = (): Complete<DefaultEventBridgeConfig> => {
  const defaultConfig: Complete<DefaultEventBridgeConfig> = {
    defaultCommandTimeout: 30000,
    instanceId: getNewInstanceId(),
    logWarnOnMessagesWithoutReceiver: true,
  }

  return defaultConfig
}
