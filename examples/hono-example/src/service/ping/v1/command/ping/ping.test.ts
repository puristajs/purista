import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { PingV1PingInputParameter, PingV1PingInputPayload } from './types.js'

describe('service Ping version 1 - command ping', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

    const payload: PingV1PingInputPayload = { ping: 'test' }

    const parameter: PingV1PingInputParameter = {
      query: 'myQuery',
    }

    const context = pingCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await ping(context.mock, payload, parameter)

    expect(result).toStrictEqual({ pong: 'test' })
  })
})
