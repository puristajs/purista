import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { StateStoreKey } from '../../../../../types'
import { userV1Service } from '../../userV1Service'
import { signUpCommandBuilder } from './signUpCommandBuilder'
import type { UserV1SignUpInputParameter, UserV1SignUpInputPayload } from './types'

describe('service User version 1 - command signUp', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('can register a new user', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const signUp = signUpCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1SignUpInputPayload = {
      name: 'test user',
      email: 'email@example.com',
      password: 'password',
    }

    const parameter: UserV1SignUpInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    context.stubs.getState.resolves({})
    context.stubs.setState.resolves()

    const result = await signUp(context.mock, payload, parameter)

    expect(result.userId).toBeDefined()
  })

  test('throws when a user with same email exist', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const signUp = signUpCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1SignUpInputPayload = {
      name: 'test user',
      email: 'email@example.com',
      password: 'password',
    }

    const parameter: UserV1SignUpInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    context.stubs.getState.resolves({
      [StateStoreKey.Users]: [
        {
          name: 'test user',
          email: 'email@example.com',
          password: 'password',
          userId: 'a5fef052-911c-472c-ac25-e2da327f0af5',
        },
      ],
    })
    context.stubs.setState.resolves()

    await expect(signUp(context.mock, payload, parameter)).rejects.toThrow('the user already exists')
  })
})
