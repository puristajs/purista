import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service'
import { pingCommandBuilder } from './pingCommandBuilder'
import { UserV1PingInputParameter, UserV1PingInputPayload } from './types'

describe('service User version 1 - command ping', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const ping = pingCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1PingInputPayload = undefined

    const parameter: UserV1PingInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    context.stubs.invoke.resolves('invoke response')

    const result = await ping(context.mock, payload, parameter)

    expect(result).toStrictEqual({ pong: 'invoke response' })
  })
})
