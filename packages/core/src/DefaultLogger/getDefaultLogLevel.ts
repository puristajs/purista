import { isDevelop } from '../core/helper/isDevelop.impl.js'
import type { LogLevelName } from '../core/types/LogLevelName.js'

/**
 * Determine the default log level based on the current environment.
 *
 * @example
 * ```ts
 * const level = getDefaultLogLevel()
 * logger.setLevel(level)
 * ```
 */
export const getDefaultLogLevel = (): LogLevelName => {
	return isDevelop() ? 'debug' : 'info'
}
