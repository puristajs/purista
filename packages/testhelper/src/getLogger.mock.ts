import { Logger } from '@purista/core'
import { stub } from 'sinon'

/**
 * Mocks the logger and methods are stubs
 * @returns logger mocked
 */
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
