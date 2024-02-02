import { getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { emailV1Service } from '../../emailV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { EmailV1PingInputParameter, EmailV1PingInputPayload } from './types.js'

describe('service Email version 1 - command ping', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = emailV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

    const payload: EmailV1PingInputPayload = 'input value'

    const parameter: EmailV1PingInputParameter = {}

    const context = pingCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await ping(context.mock, payload, parameter)

    expect(result).toStrictEqual({ pong: 'input value' })
  })
})
