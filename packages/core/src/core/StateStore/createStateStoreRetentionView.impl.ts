import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StateDeleteFunction } from './types/StateDeleteFunction.js'
import type { StateGetterFunction } from './types/StateGetterFunction.js'
import {
	resolveStateWriteOptions,
	type StateRetention,
	type StateRetentionPolicy,
	type StateWriteOptions,
} from './types/StateRetention.js'
import type { StateStore } from './types/StateStore.js'

const assertSupportsRetention = (store: StateStore, retention: StateRetention) => {
	if (retention.mode === 'expire' && store.capabilities?.retention.atomicExpiry !== true) {
		throw new UnhandledError(StatusCode.NotImplemented, `state store "${store.name}" does not support atomic expiry`)
	}
}

/**
 * Creates an immutable retention view over a state store.
 *
 * The view is safe to use around a shared store: its policy is local to this
 * view and never changes the wrapped store or another service's behavior.
 * Retention resolution is deterministic: write options take precedence over
 * the view default, and no policy means permanent state. A finite result is
 * accepted only when the wrapped store explicitly declares native atomic
 * expiry support.
 *
 * @example
 * ```ts
 * const sessionState = createStateStoreRetentionView(stateStore, {
 *   default: { mode: 'expire', ttlMs: 30 * 24 * 60 * 60_000 },
 * })
 * ```
 *
 * @group Store
 */
export const createStateStoreRetentionView = (store: StateStore, policy?: StateRetentionPolicy): StateStore => {
	const getState: StateGetterFunction = store.getState.bind(store)
	const removeState: StateDeleteFunction = store.removeState.bind(store)

	return {
		name: store.name,
		capabilities: store.capabilities,
		getState,
		removeState,
		async setState(stateName: string, stateValue: unknown, options?: StateWriteOptions) {
			if (!policy) {
				if (options?.retention) {
					const { retention } = resolveStateWriteOptions(options)
					assertSupportsRetention(store, retention)
				}
				return store.setState(stateName, stateValue, options)
			}

			const resolvedOptions = resolveStateWriteOptions(options, policy.default)
			assertSupportsRetention(store, resolvedOptions.retention)
			return store.setState(stateName, stateValue, resolvedOptions)
		},
		destroy: store.destroy.bind(store),
	}
}
