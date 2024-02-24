import { DAPR_API_VERSION, DEFAULT_DAPR_HOST, DEFAULT_DAPR_PORT } from '../types/index.js'

export const getDefaultClientConfig = () => {
  return {
    daprHost: process.env.DAPR_HOST ?? DEFAULT_DAPR_HOST,
    daprPort: process.env.DAPR_HTTP_PORT ?? DEFAULT_DAPR_PORT,
    daprApiToken: undefined,
    isKeepAlive: true,
    pubSubName: 'pubsub',
    daprApiVersion: DAPR_API_VERSION,
    appPrefix: 'app-',
  }
}
