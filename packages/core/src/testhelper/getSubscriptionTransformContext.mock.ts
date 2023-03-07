import { SinonSandbox, stub } from 'sinon'

import { EBMessage, SubscriptionTransformFunctionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'

/* A function that returns a mock object for subscription transform function context */
export const getSubscriptionTransformContext = (message: EBMessage, sandbox?: SinonSandbox) => {
  const logger = getLoggerMock(sandbox)
  const stubs = {
    logger: logger.stubs,
    wrapInSpan: sandbox?.stub() || stub(),
    startActiveSpan: sandbox?.stub() || stub(),
  }

  const mock: SubscriptionTransformFunctionContext = {
    logger: logger.mock,
    message,
    wrapInSpan: stubs.wrapInSpan.callsFake((_name, _opts, fn) => fn()),
    startActiveSpan: stubs.startActiveSpan.callsFake((_name, _opts, _context, fn) => fn()),
  }

  return {
    mock,
    stubs,
  }
}
