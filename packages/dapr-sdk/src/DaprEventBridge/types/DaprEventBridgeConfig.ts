import { HttpEventBridgeConfig } from '@purista/core'

import { DaprClientConfig } from '../../DaprClient'

export type DaprEventBridgeConfig = HttpEventBridgeConfig & {
  clientConfig: DaprClientConfig
}
