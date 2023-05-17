import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service'
import { pingCommandBuilder } from './pingCommandBuilder'
import { PingV1PingInputParameter, PingV1PingInputPayload } from './types'

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

    const ping = pingCommandBuilder.getCommandFunction().bind(service)

    const payload: PingV1PingInputPayload = { ping: 'test' }

    const parameter: PingV1PingInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await ping(context.mock, payload, parameter)

    expect(result).toStrictEqual({ pong: 'test' })
  })
})
