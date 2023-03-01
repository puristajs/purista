import { SinonSandbox, SinonStub, stub } from 'sinon'

import { Logger } from '../core'

/**
 * Mocks the logger and methods are stubs
 * @returns logger mocked
 */
export const getLoggerMock = (sandbox?: SinonSandbox): { mock: Logger; stubs: Record<string, SinonStub> } => {
  const info = sandbox?.stub() || stub()
  const error = sandbox?.stub() || stub()
  const warn = sandbox?.stub() || stub()
  const debug = sandbox?.stub() || stub()
  const trace = sandbox?.stub() || stub()
  const fatal = sandbox?.stub() || stub()

  const mock: Logger = {
    info,
    error,
    warn,
    debug,
    trace,
    fatal,
    getChildLogger: () => mock,
  }

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
