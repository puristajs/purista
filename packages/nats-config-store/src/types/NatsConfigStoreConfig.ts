import type { Prettify } from '@purista/core'
import type { ConnectionOptions, KvOptions } from 'nats'

/**
 * NATS JetStream key-value configuration for `NatsConfigStore`.
 *
 * Combines NATS connection options with KV bucket options. Configure credentials
 * through the standard NATS connection fields or your runtime environment, and
 * avoid placing secrets in source-controlled config examples.
 */
export type NatsConfigStoreConfig = Prettify<
	{
		/**
		 * Name of the JetStream key-value bucket used for config values.
		 *
		 * @default 'purista-config-store'
		 */
		keyValueStoreName: string
	} & ConnectionOptions &
		Partial<KvOptions>
>
