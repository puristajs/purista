import { stub } from 'sinon'

import { Logger } from '../types'

export const getLoggerMock = (): Logger => {
  const info = stub()
  const error = stub()
  const warn = stub()
  const debug = stub()
  const trace = stub()

  const logger: Logger = {
    info,
    error,
    warn,
    debug,
    trace,
    getChildLogger: () => logger,
  } as unknown as Logger

  return logger
}
