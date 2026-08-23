import type { StateDeleteFunction } from './StateDeleteFunction.js'
import type { StateGetterFunction } from './StateGetterFunction.js'
import type { StateSetterFunction } from './StateSetterFunction.js'
import type { StateStoreCapabilities } from './StateStoreCapabilities.js'

/**
 * Interface definition for state store implementations
 *
 * @group Store
 */
export interface StateStore {
	/** name of store */
	name: string
	/**
	 * Guarantees offered by this adapter.
	 *
	 * This is optional for existing custom stores. Such stores must treat an
	 * expiry request as unsupported unless they explicitly document otherwise.
	 */
	readonly capabilities?: StateStoreCapabilities
	/**
	 * get a state value
	 * @param string name of state
	 * @returns the state
	 * @throws UnhandledError
	 */
	getState: StateGetterFunction

	/**
	 * delete a state value
	 * @param string name of state
	 * @throws UnhandledError
	 */
	removeState: StateDeleteFunction

	/**
	 * set a state value
	 * @param string name of state
	 * @param value value of state
	 * @throws UnhandledError
	 */
	setState: StateSetterFunction

	/**
	 * disconnects and shuts down the state store
	 */
	destroy(): Promise<void>
}
