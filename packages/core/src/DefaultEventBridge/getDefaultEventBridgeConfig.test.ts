import { getDefaultEventBridgeConfig } from './getDefaultEventBridgeConfig.impl'

it('returns default config for DefaultEventBridge', () => {
  const config = getDefaultEventBridgeConfig()

  expect(config).toBeDefined()
  expect(config.logWarnOnMessagesWithoutReceiver).toBeTruthy()
})
