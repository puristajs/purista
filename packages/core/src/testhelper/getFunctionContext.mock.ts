import { SinonSandbox, stub } from 'sinon'

import { Command, CommandFunctionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'
import { createTestCommandMsg } from './messages'

export const getFunctionContextMock = <MessagePayloadType = unknown, MessageParamsType = unknown>(
  payload: MessagePayloadType,
  parameter: MessageParamsType,
  sandbox?: SinonSandbox,
) => {
  const logger = getLoggerMock(sandbox)
  const stubs = {
    logger: logger.stubs,
    emit: sandbox?.stub() || stub(),
    invoke: sandbox?.stub() || stub(),
    performance: [],
    wrapInSpan: sandbox?.stub() || stub(),
    startActiveSpan: sandbox?.stub() || stub(),
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
    wrapInSpan: stubs.wrapInSpan,
    startActiveSpan: stubs.startActiveSpan,
  }

  return {
    mock,
    stubs,
  }
}
