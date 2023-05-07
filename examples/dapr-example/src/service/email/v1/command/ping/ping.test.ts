import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { emailV1Service } from '../../emailV1Service'
import { pingCommandBuilder } from './pingCommandBuilder'
import { EmailV1PingInputParameter, EmailV1PingInputPayload } from './types'

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

    const ping = pingCommandBuilder.getCommandFunction().bind(service)

    const payload: EmailV1PingInputPayload = 'input value'

    const parameter: EmailV1PingInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await ping(context.mock, payload, parameter)

    expect(result).toStrictEqual({ pong: 'input value' })
  })
})
