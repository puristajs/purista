/**
 * Retention applied to one state write.
 *
 * State is retained forever unless a StateStore, service, or caller selects
 * `expire`. The `ttlMs` value is resolved when the write happens, so writing
 * the same key again with this retention refreshes its expiry deadline.
 *
 * @group Store
 */
export type StateRetention =
	| {
			/** Keep the value until it is overwritten or removed. */
			mode: 'forever'
	  }
	| {
			/** Remove the value after `ttlMs` milliseconds. */
			mode: 'expire'
			/** Positive, finite retention duration in milliseconds. */
			ttlMs: number
	  }

/**
 * Optional controls for a single state write.
 *
 * @example
 * ```ts
 * await context.states.setState('password-reset:abc', token, {
 *   retention: { mode: 'expire', ttlMs: 15 * 60_000 },
 * })
 * ```
 *
 * @group Store
 */
export type StateWriteOptions = {
	/**
	 * Retention for this write. Omit it to use the service or StateStore default
	 * (which is `forever` when neither provides one).
	 */
	retention?: StateRetention
}

/**
 * Default retention applied by a StateStore or an immutable state-store view.
 *
 * A service can create its own view over a shared store with this policy, while
 * a StateStore can use it as its instance default. A service view never mutates
 * the shared store, so two services can safely use different defaults. A
 * write-level retention is always more specific than this default.
 *
 * @group Store
 */
export type StateRetentionPolicy = {
	/** Retention used when a write does not provide `options.retention`. */
	default: StateRetention
}

/**
 * Normalized state write options passed to state store implementations.
 *
 * Public callers use {@link StateWriteOptions}; implementations receive this
 * form so they never need to invent their own fallback retention behavior.
 *
 * @group Store
 */
export type ResolvedStateWriteOptions = {
	retention: StateRetention
}

/** Shared immutable retention value used when no expiration is requested. */
export const stateRetentionForever: Readonly<StateRetention> = Object.freeze({ mode: 'forever' })

/**
 * Resolves and validates a state write's retention.
 *
 * This deliberately does not schedule generic cleanup. A store can only
 * accept expiring writes when it declares native atomic expiry support.
 *
 * @group Store
 */
export const resolveStateWriteOptions = (
	options?: StateWriteOptions,
	defaultRetention: StateRetention = stateRetentionForever,
): ResolvedStateWriteOptions => {
	const retention = options?.retention ?? defaultRetention

	if (retention.mode === 'forever') {
		return { retention }
	}

	if (retention.mode === 'expire' && Number.isFinite(retention.ttlMs) && retention.ttlMs > 0) {
		return { retention }
	}

	throw new TypeError('state retention ttlMs must be a positive finite number of milliseconds')
}
