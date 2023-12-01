import type { StateDeleteFunction } from './StateDeleteFunction'
import type { StateGetterFunction } from './StateGetterFunction'
import type { StateSetterFunction } from './StateSetterFunction'

/**
 * Interface definition for state store implementations
 *
 * @group Store
 */
export interface StateStore {
  /** name of store */
  name: string
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
