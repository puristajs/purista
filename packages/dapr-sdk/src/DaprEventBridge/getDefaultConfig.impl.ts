import { Complete } from '@purista/core'

import { getDefaultClientConfig } from '../DaprClient/getDefaultClientConfig.impl'
import { DaprEventBridgeConfig } from './types'

export const getDefaultConfig = (): Complete<Omit<Complete<DaprEventBridgeConfig>, 'client' | 'serve'>> => {
  const serverPort = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 8080

  return {
    name: 'DaprEventBridge',
    serverHost: process.env.SERVER_HOST || '127.0.0.1',
    serverPort,
    pathPrefix: 'purista',
    apiPrefix: 'api',
    enableRestApiExpose: true,
    subscriptionPayloadAsCloudEvent: true,
    commandPayloadAsCloudEvent: false,

    clientConfig: getDefaultClientConfig(),
  }
}
