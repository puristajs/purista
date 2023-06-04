import { HttpEventBridgeConfig } from '@purista/base-http-bridge'
import { Prettify } from '@purista/core'

import { DaprClientConfig } from '../../DaprClient'

export type DaprEventBridgeConfig = Prettify<
  HttpEventBridgeConfig & {
    clientConfig?: DaprClientConfig
  }
>
