import { stub } from 'sinon'

import { Command, CommandFunctionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'
import { createTestCommandMsg } from './messages'

export const getFunctionContextMock = <MessagePayloadType = unknown, MessageParamsType = unknown>(
  payload: MessagePayloadType,
  parameter: MessageParamsType,
) => {
  const logger = getLoggerMock()
  const stubs = {
    logger: logger.stubs,
    emit: stub(),
    invoke: stub(),
    performance: [],
  }

  const message: Command<MessagePayloadType, MessageParamsType> = createTestCommandMsg({
    payload: {
      payload,
      parameter,
    },
  })

  const mock: CommandFunctionContext<MessagePayloadType, MessageParamsType> = {
    logger: logger.mock,
    message,
    emit: stubs.emit,
    invoke: stubs.invoke,
    performance: stubs.performance,
  }

  return {
    mock,
    stubs,
  }
}
