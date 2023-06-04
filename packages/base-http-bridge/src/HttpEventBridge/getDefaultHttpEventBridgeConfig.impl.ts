import { Complete, EventBridgeConfig } from '@purista/core'

import { HttpEventBridgeConfig } from './types'

export const getDefaultHttpEventBridgeConfig = (): EventBridgeConfig<Omit<HttpEventBridgeConfig, 'serve'>> => {
  const config: Complete<Omit<HttpEventBridgeConfig, 'serve'>> = {
    name: 'HttpEventBridge',
    serverHost: '127.0.0.1',
    serverPort: 8080,
    apiPrefix: '/api',
    enableRestApiExpose: true,
    pathPrefix: 'purista',
    subscriptionPayloadAsCloudEvent: false,
    commandPayloadAsCloudEvent: false,
  }

  return config
}
