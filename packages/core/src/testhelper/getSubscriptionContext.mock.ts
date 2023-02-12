import { SinonSandbox, stub } from 'sinon'

import { SubscriptionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'

export const getSubscriptionContextMock = <MessageType>(message: MessageType, sandbox?: SinonSandbox) => {
  const logger = getLoggerMock(sandbox)
  const stubs = {
    logger: logger.stubs,
    emit: sandbox?.stub() || stub(),
    invoke: sandbox?.stub() || stub(),
    performance: [],
    wrapInSpan: sandbox?.stub() || stub(),
    startActiveSpan: sandbox?.stub() || stub(),
  }

  const mock: SubscriptionContext<MessageType> = {
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
