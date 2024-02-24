import type { SinonSandbox, SinonStub } from 'sinon'
import { stub } from 'sinon'

import type { Logger } from '../core/index.js'

/**
 * Mocks the logger and methods are stubs
 * @returns logger mocked
 * @group Unit test helper
 */
export const getLoggerMock = (sandbox?: SinonSandbox) => {
  const info = sandbox?.stub() ?? stub()
  const error = sandbox?.stub() ?? stub()
  const warn = sandbox?.stub() ?? stub()
  const debug = sandbox?.stub() ?? stub()
  const trace = sandbox?.stub() ?? stub()
  const fatal = sandbox?.stub() ?? stub()

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
      fatal,
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
