import { stub } from 'sinon'

import { SubscriptionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'

export const getSubscriptionContextMock = <MessageType>(message: MessageType) => {
  const logger = getLoggerMock()
  const stubs = {
    logger: logger.stubs,
    emit: stub(),
    invoke: stub(),
    performance: [],
    wrapInSpan: stub(),
    startActiveSpan: stub(),
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
