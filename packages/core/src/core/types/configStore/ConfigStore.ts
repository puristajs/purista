import { ConfigGetterFunction } from './ConfigGetterFunction'
import { ConfigSetterFunction } from './ConfigSetterFunction'

export interface ConfigStore {
  /**
   * indicates if the config store has been started and is connected to persistance
   */
  isReady(): Promise<boolean>

  /**
   * indicates if the config store persistance is reachable
   */
  isHealthy(): Promise<boolean>

  /**
   * connects the config store to persistance
   */
  start(): Promise<void>

  /**
   * get a config value
   * @param string name of config
   * @returns the config
   * @throws UnhandledError
   */
  getConfig: ConfigGetterFunction

  /**
   * set a config value
   * @param string name of config
   * @param value value of config
   * @throws UnhandledError
   */
  setConfig: ConfigSetterFunction

  /**
   * disconnects and shuts down the config store
   */
  destroy(): Promise<void>
}
