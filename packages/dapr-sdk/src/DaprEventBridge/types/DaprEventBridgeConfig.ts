import type { HttpEventBridgeConfig } from '@purista/base-http-bridge'
import type { Prettify } from '@purista/core/adapter'

import type { DaprClientConfig } from '../../DaprClient/types/DaprClientConfig.js'

/**
 * Configuration for {@link DaprEventBridge}.
 */
export type DaprEventBridgeConfig = Prettify<
	HttpEventBridgeConfig & {
		/** Dapr sidecar client settings for invocation, Pub/Sub and health checks. */
		clientConfig?: DaprClientConfig
	}
>
