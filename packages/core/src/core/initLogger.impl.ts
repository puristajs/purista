import { Logger as TsLogger } from 'tslog'

import { Logger, LogLevelName } from './types'

/**
 * Create a new logger with the given minimum log level
 * @param {LogLevelName | undefined} minLevel - The minimum level of log messages to display.
 */
export const initLogger = (minLevel: LogLevelName | undefined, opt?: Record<string, unknown>): Logger =>
  new TsLogger({
    name: 'base',
    minLevel,
    displayFilePath: 'hidden',
    displayLoggerName: true,
    displayRequestId: true,
    displayFunctionName: true,
    ...opt,
  })
