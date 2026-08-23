import type { Prettify } from '@purista/core/adapter'
import type { ConnectionOptions, KvOptions } from 'nats'

/**
 * NATS JetStream key-value configuration for `NatsStateStore`.
 *
 * Combines NATS connection options with KV bucket options. Configure credentials
 * through the standard NATS connection fields or your runtime environment, and
 * avoid placing secrets in source-controlled config examples.
 */
export type NatsStateStoreConfig = Prettify<
	{
		/**
		 * Name of the JetStream key-value bucket used for state values.
		 *
		 * @default 'purista-state-store'
		 */
		keyValueStoreName: string
	} & ConnectionOptions &
		Partial<KvOptions>
>
