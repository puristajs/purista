import { ISettingsParam, Logger as TsLogger } from 'tslog'

import { DefaultLogger } from './DefaultLogger'
import type { Logger, LogLevelName } from './types'

/**
 * Create a new logger with the given minimum log level
 * @param {LogLevelName | undefined} minLevel - The minimum level of log messages to display.
 */
export const initLogger = (minLevel: LogLevelName | undefined, opt?: ISettingsParam): Logger => {
  return new DefaultLogger(
    new TsLogger({
      name: 'PURISTA',
      minLevel,
      displayFilePath: 'hidden',
      displayLoggerName: true,
      displayRequestId: true,
      displayFunctionName: false,
      ...opt,
    }),
  )
}
