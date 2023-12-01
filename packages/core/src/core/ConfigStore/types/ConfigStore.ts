import type { ConfigDeleteFunction } from './ConfigDeleteFunction'
import type { ConfigGetterFunction } from './ConfigGetterFunction'
import type { ConfigSetterFunction } from './ConfigSetterFunction'

/**
 * Interface definition for config store adapters
 *
 * @group Store
 */
export interface ConfigStore {
  /** name of store */
  name: string
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
   * delete a config value
   * @param string name of config
   * @throws UnhandledError
   */
  removeConfig: ConfigDeleteFunction

  /**
   * disconnects and shuts down the config store
   */
  destroy(): Promise<void>
}
