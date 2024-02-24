import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { theServiceV1Service } from '../../theServiceV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { TheServiceV1PingInputParameter, TheServiceV1PingInputPayload } from './types.js'

describe('service TheService version 1 - command ping', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = await theServiceV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

    const payload: TheServiceV1PingInputPayload = undefined

    const parameter: TheServiceV1PingInputParameter = {}

    const context = pingCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await ping(context.mock, payload, parameter)

    expect(result).toEqual({ ping: true })
  })
})
