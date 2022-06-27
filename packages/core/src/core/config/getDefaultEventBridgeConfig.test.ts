import { getDefaultEventBridgeConfig } from './getDefaultEventBridgeConfig.impl'

it('returns default config for DefaultEventBridge', () => {
  const config = getDefaultEventBridgeConfig()

  expect(config).toBeDefined()
  expect(config.defaultTtl).not.toBeNaN()
  expect(typeof config.defaultTtl).toBe('number')
})
