import { Complete } from '@purista/core'

import { DaprEventBridgeConfig } from './types'

export const getDefaultConfig = (): Complete<DaprEventBridgeConfig> => {
  return {
    serverHost: process.env.SERVER_HOST || '127.0.0.1',
    serverPort: process.env.APP_PORT || '8080',
    daprHost: process.env.DAPR_HOST || 'http://127.0.0.1',
    daprPort: process.env.DAPR_HTTP_PORT || '3500',
    isKeepAlive: true,
    actor: undefined,
    daprApiToken: undefined,
    pathPrefix: '/purista',
  }
}
