import { HttpEventBridgeConfig, Prettify } from '@purista/core'

import { DaprClientConfig } from '../../DaprClient'

export type DaprEventBridgeConfig = Prettify<
  HttpEventBridgeConfig & {
    clientConfig: DaprClientConfig
  }
>
