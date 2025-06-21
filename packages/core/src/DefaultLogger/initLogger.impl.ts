import type { LoggerOptions } from 'pino'
import { pino } from 'pino'
import type { Logger } from '../core/types/Logger.js'
import type { LogLevelName } from '../core/types/LogLevelName.js'
import { puristaVersion } from '../version.js'
import { DefaultLogger } from './DefaultLogger.impl.js'
import { getDefaultLogLevel } from './getDefaultLogLevel.js'

/**
 * Create a new logger instance using pino.
 *
 * @param minLevel - The minimum log level to use.
 * @param opt - Optional pino configuration.
 *
 * @example
 * ```ts
 * const logger = initLogger('debug')
 * logger.info('logger ready')
 * ```
 */
export const initLogger = (level: LogLevelName = getDefaultLogLevel(), opt?: LoggerOptions): Logger => {
	return new DefaultLogger(
		pino({
			name: 'PURISTA',
			mixin(context: any, _level: any) {
				return { puristaVersion, ...context }
			},
			mixinMergeStrategy(mergeObject: any, mixinObject: any) {
				return Object.assign(mixinObject, mergeObject)
			},
			...opt,
			level,
		}),
	)
}
