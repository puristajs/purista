import { SinonSandbox, stub } from 'sinon'

import { EBMessage, SubscriptionFunctionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'

/* A function that returns a subscription function context mock object. */
export const getSubscriptionContextMock = (message: EBMessage, sandbox?: SinonSandbox) => {
  const logger = getLoggerMock(sandbox)
  const stubs = {
    logger: logger.stubs,
    emit: sandbox?.stub() || stub(),
    invoke: sandbox?.stub() || stub(),
    performance: [],
    wrapInSpan: sandbox?.stub() || stub(),
    startActiveSpan: sandbox?.stub() || stub(),
  }

  const mock: SubscriptionFunctionContext = {
    logger: logger.mock,
    message,
    emit: stubs.emit,
    invoke: stubs.invoke,
    wrapInSpan: stubs.wrapInSpan,
    startActiveSpan: stubs.startActiveSpan,
  }

  return {
    mock,
    stubs,
  }
}
