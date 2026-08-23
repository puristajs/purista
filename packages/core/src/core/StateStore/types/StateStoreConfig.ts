import type { Prettify } from '../../types/Prettify.js'
import type { StoreBaseConfig } from '../../types/StoreBaseConfig.js'
import type { StateRetentionPolicy } from './StateRetention.js'

/**
 * Configuration shared by StateStore adapters.
 *
 * `retention` is the store-instance default. Use it when this StateStore has a
 * deliberate lifetime policy of its own. A service can override it locally
 * with `stateRetention`, and an individual `setState` call can override both.
 *
 * @example
 * ```ts
 * const store = new RedisStateStore({
 *   retention: { default: { mode: 'expire', ttlMs: 24 * 60 * 60_000 } },
 *   config: { url: process.env.REDIS_URL },
 * })
 * ```
 *
 * @group Store
 */
export type StateStoreConfig<Config extends Record<string, unknown>> = Prettify<
	StoreBaseConfig<Config> & {
		/** Default retention for writes made directly to this StateStore. */
		retention?: StateRetentionPolicy
	}
>
