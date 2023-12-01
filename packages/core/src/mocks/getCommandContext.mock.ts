import type { SinonSandbox } from 'sinon'
import { stub } from 'sinon'

import type { CommandFunctionContext } from '../core'
import { getLoggerMock } from './getLogger.mock'
import { getCommandMessageMock } from './messages'

/**
 * A function that returns a mock object for command function context
 *
 * @group Unit test helper
 * */
export const getCommandContextMock = <MessagePayloadType = unknown, MessageParamsType = unknown>(
  payload: MessagePayloadType,
  parameter: MessageParamsType,
  sandbox?: SinonSandbox,
) => {
  const logger = getLoggerMock(sandbox)

  const getMockSpan = () => {
    return {
      spanContext: () => {
        return {
          traceId: 'fake',
          spanId: 'fake',
          isRemote: false,
          traceFlags: 0,
        }
      },
      setAttribute: sandbox?.stub() || stub(),
      setAttributes: sandbox?.stub() || stub(),
      addEvent: sandbox?.stub() || stub(),
      setStatus: sandbox?.stub() || stub(),
      updateName: sandbox?.stub() || stub(),
      end: sandbox?.stub() || stub(),
      isRecording: () => true,
      recordException: (sandbox?.stub() || stub()).callsFake((err: any) => {
        // eslint-disable-next-line no-console
        console.error(err)
      }),
    }
  }

  const stubs = {
    logger: logger.stubs,
    emit: sandbox?.stub() || stub(),
    invoke: sandbox?.stub() || stub(),
    wrapInSpan: sandbox?.stub() || stub(),
    startActiveSpan: sandbox?.stub() || stub(),
    getSecret: sandbox?.stub() || stub(),
    setSecret: sandbox?.stub() || stub(),
    removeSecret: sandbox?.stub() || stub(),
    getConfig: sandbox?.stub() || stub(),
    setConfig: sandbox?.stub() || stub(),
    removeConfig: sandbox?.stub() || stub(),
    getState: sandbox?.stub() || stub(),
    setState: sandbox?.stub() || stub(),
    removeState: sandbox?.stub() || stub(),
  }

  const message = getCommandMessageMock({
    payload: {
      payload,
      parameter,
    },
  })

  const mock: CommandFunctionContext<MessagePayloadType, MessageParamsType> = {
    logger: logger.mock,
    message,
    emit: stubs.emit.rejects(new Error('emit is not stubbed')),
    invoke: stubs.invoke.rejects(new Error('Invoke is not stubbed')),
    wrapInSpan: stubs.wrapInSpan.callsFake((_name, _opts, fn) => fn(getMockSpan())),
    startActiveSpan: stubs.startActiveSpan.callsFake((_name, _opts, _context, fn) => fn(getMockSpan())),
    secrets: {
      getSecret: stubs.getSecret.rejects(new Error('getSecret is not stubbed')),
      setSecret: stubs.setSecret.rejects(new Error('setSecret is not stubbed')),
      removeSecret: stubs.removeSecret.rejects(new Error('removeSecret is not stubbed')),
    },
    configs: {
      getConfig: stubs.getConfig.rejects(new Error('getConfig is not stubbed')),
      setConfig: stubs.setConfig.rejects(new Error('setConfig is not stubbed')),
      removeConfig: stubs.removeConfig.rejects(new Error('removeConfig is not stubbed')),
    },
    states: {
      getState: stubs.getState.rejects(new Error('getState is not stubbed')),
      setState: stubs.setState.rejects(new Error('setState is not stubbed')),
      removeState: stubs.removeState.rejects(new Error('removeState is not stubbed')),
    },
  }

  return {
    mock,
    stubs,
  }
}
