import type { LogLevelName } from './LogLevelName.js'
import type { Logger } from './Logger.js'
import type { Prettify } from './Prettify.js'

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

		/**
		 * Enable cache
		 */
		enableCache?: boolean

		/**
		 * Cache time to live in ms
		 */
		cacheTtl?: number
	} & Config
>
