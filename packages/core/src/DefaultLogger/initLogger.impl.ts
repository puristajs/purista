import type { LoggerOptions } from 'pino'
import { pino } from 'pino'

import type { Logger, LogLevelName } from '../core/types/index.js'
import { puristaVersion } from '../version.js'
import { DefaultLogger } from './DefaultLogger.impl.js'
import { getDefaultLogLevel } from './getDefaultLogLevel.js'

/**
 * Create a new logger with the given minimum log level
 * @param {LogLevelName | undefined} minLevel - The minimum level of log messages to display.
 * @param {LoggerOptions}
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
