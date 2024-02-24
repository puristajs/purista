import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service.js'
import { createUserCommandBuilder } from './createUserCommandBuilder.js'
import type { UserV1CreateUserInputParameter, UserV1CreateUserInputPayload } from './types.js'

describe('service User version 1 - command createUser', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = await userV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const createUser = safeBind(createUserCommandBuilder.getCommandFunction(), service)

    const payload: UserV1CreateUserInputPayload = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    const parameter: UserV1CreateUserInputParameter = {}

    const context = createUserCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await createUser(context.mock, payload, parameter)

    expect(result.userId).toBeDefined()
  })
})
