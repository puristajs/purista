import { StateGetterFunction } from './StateGetterFunction'
import { StateSetterFunction } from './StateSetterFunction'

export interface StateStore {
  /**
   * indicates if the state store has been started and is connected to persistance
   */
  isReady(): Promise<boolean>

  /**
   * indicates if the state store persistance is reachable
   */
  isHealthy(): Promise<boolean>

  /**
   * connects the state store to persistance
   */
  start(): Promise<void>

  /**
   * get a state value
   * @param string name of state
   * @returns the state
   * @throws UnhandledError
   */
  getState: StateGetterFunction

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
