/**
 * Retention guarantees exposed by a state store adapter.
 *
 * `atomicExpiry` is true only when the adapter applies the expiration deadline
 * in the same durable operation as the value write. It does not imply that a
 * generic cleanup worker exists or that non-expiring values are swept.
 *
 * @group Store
 */
export type StateStoreRetentionCapabilities = {
	/** The adapter can atomically write a value with an expiry deadline. */
	atomicExpiry: boolean
}

/**
 * Capability matrix for a state store adapter.
 *
 * Adapters must report guarantees honestly. PURISTA rejects an expiring write
 * through {@link StateStoreBaseClass} when `atomicExpiry` is false instead of
 * silently dropping the requested retention.
 *
 * @group Store
 */
export type StateStoreCapabilities = {
	retention: StateStoreRetentionCapabilities
}

/** Capabilities used by stores that only support permanent values. */
export const stateStoreCapabilitiesWithoutExpiry: Readonly<StateStoreCapabilities> = Object.freeze({
	retention: Object.freeze({ atomicExpiry: false }),
})
