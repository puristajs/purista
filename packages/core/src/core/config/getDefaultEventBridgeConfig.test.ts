import { getDefaultEventBridgeConfig } from './getDefaultEventBridgeConfig.impl'

it('returns default config for DefaultEventBridge', () => {
  const config = getDefaultEventBridgeConfig()

  expect(config).toBeDefined()
  expect(config.defaultCommandTimeout).not.toBeNaN()
  expect(typeof config.defaultCommandTimeout).toBe('number')
})
