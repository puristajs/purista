import pino, { LoggerOptions } from 'pino'

import type { Logger, LogLevelName } from '../types'
import { DefaultLogger } from './DefaultLogger.impl'
import { getDefaultLogLevel } from './getDefaultLogLevel'

/**
 * Create a new logger with the given minimum log level
 * @param {LogLevelName | undefined} minLevel - The minimum level of log messages to display.
 * @param {LoggerOptions}
 */
export const initLogger = (level: LogLevelName = getDefaultLogLevel(), opt?: LoggerOptions): Logger => {
  return new DefaultLogger(
    pino({
      name: 'PURISTA',
      ...opt,
      level,
    }),
  )
}
