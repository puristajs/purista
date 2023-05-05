import { Logger } from './Logger'
import { LogLevelName } from './LogLevelName'
import { Prettify } from './Prettify'

/**
 * Basic configuration object which is used by any store
 */
export type StoreBaseConfig<Config extends Record<string, unknown>> = Prettify<
  {
    /**
     * Enable generally get method
     */
    enableGet?: boolean
    /**
     * Enable generally set method
     */
    enableSet?: boolean
    /**
     * Enable generally remove method
     */
    enableRemove?: boolean
    /**
     * A logger instance
     */
    logger?: Logger
    /**
     * A log level for new logger if logger is not set
     */
    logLevel?: LogLevelName
  } & Config
>
