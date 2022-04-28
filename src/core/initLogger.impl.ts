import { Logger as TsLogger } from 'tslog'

import { Logger, LogLevelName } from './types'

/**
 * Create a new logger with the given minimum log level
 * @param {LogLevelName | undefined} minLevel - The minimum level of log messages to display.
 */
export const initLogger = (minLevel: LogLevelName | undefined): Logger =>
  new TsLogger({
    name: 'base',
    minLevel,
    displayFilePath: 'hidden',
  })
