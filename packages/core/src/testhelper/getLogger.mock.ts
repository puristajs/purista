import { SinonStub, stub } from 'sinon'

import { Logger } from '../core'

/**
 * Mocks the logger and methods are stubs
 * @returns logger mocked
 */
export const getLoggerMock = (): { mock: Logger; stubs: Record<string, SinonStub> } => {
  const info = stub()
  const error = stub()
  const warn = stub()
  const debug = stub()
  const trace = stub()

  const mock: Logger = {
    info,
    error,
    warn,
    debug,
    trace,
    getChildLogger: () => mock,
  } as unknown as Logger

  return {
    stubs: {
      info,
      error,
      warn,
      debug,
      trace,
    },
    mock,
  }
}

export type LoggerStubs = {
  info: SinonStub
  error: SinonStub
  warn: SinonStub
  debug: SinonStub
  trace: SinonStub
}
