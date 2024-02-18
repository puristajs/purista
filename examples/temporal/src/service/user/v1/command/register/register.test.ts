import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service.js'
import { registerCommandBuilder } from './registerCommandBuilder.js'
import type { UserV1RegisterInputParameter, UserV1RegisterInputPayload } from './types.js'

describe('service User version 1 - command register', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const register = safeBind(registerCommandBuilder.getCommandFunction(), service)

    const payload: UserV1RegisterInputPayload = undefined

    const parameter: UserV1RegisterInputParameter = {}

    const context = registerCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await register(context.mock, payload, parameter)

    expect(result).toBeUndefined()
  })
})
