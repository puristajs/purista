import type { HttpEventBridgeConfig } from '@purista/base-http-bridge'
import type { Prettify } from '@purista/core'

import type { DaprClientConfig } from '../../DaprClient/index.js'

export type DaprEventBridgeConfig = Prettify<
	HttpEventBridgeConfig & {
		clientConfig?: DaprClientConfig
	}
>
