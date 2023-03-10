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
    getSecret: sandbox?.stub() || stub(),
    setSecret: sandbox?.stub() || stub(),
    getConfig: sandbox?.stub() || stub(),
    setConfig: sandbox?.stub() || stub(),
  }

  const mock: SubscriptionTransformFunctionContext = {
    logger: logger.mock,
    message,
    wrapInSpan: stubs.wrapInSpan.callsFake((_name, _opts, fn) => fn()),
    startActiveSpan: stubs.startActiveSpan.callsFake((_name, _opts, _context, fn) => fn()),
    getSecret: stubs.getSecret.rejects(new Error('getSecret is not stubbed')),
    setSecret: stubs.setSecret.rejects(new Error('setSecret is not stubbed')),
    getConfig: stubs.getConfig.rejects(new Error('getConfig is not stubbed')),
    setConfig: stubs.setConfig.rejects(new Error('setConfig is not stubbed')),
  }

  return {
    mock,
    stubs,
  }
}
