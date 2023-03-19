import { StateDeleteFunction } from './StateDeleteFunction'
import { StateGetterFunction } from './StateGetterFunction'
import { StateSetterFunction } from './StateSetterFunction'

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
