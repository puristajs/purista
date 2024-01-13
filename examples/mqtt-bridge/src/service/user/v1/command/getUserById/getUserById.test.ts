import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import type { User } from '../../../../../types/index.js'
import { StateStoreKey } from '../../../../../types/index.js'
import { userV1Service } from '../../userV1Service.js'
import { getUserByIdCommandBuilder } from './getUserByIdCommandBuilder.js'
import type { UserV1GetUserByIdInputParameter, UserV1GetUserByIdInputPayload } from './types.js'

describe('service User version 1 - command getUserById', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('returns a user', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const getUserById = getUserByIdCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1GetUserByIdInputPayload = undefined

    const userMock: User = {
      email: 'email@example.com',
      name: 'test user',
      password: 'password',
      userId: 'a5fef052-911c-472c-ac25-e2da327f0af5',
    }

    const parameter: UserV1GetUserByIdInputParameter = {
      userId: userMock.userId,
    }

    const context = getUserByIdCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    context.stubs.getState.resolves({ [StateStoreKey.Users]: [userMock] })

    const result = await getUserById(context.mock, payload, parameter)

    expect(result).toStrictEqual({ email: userMock.email, name: userMock.name, userId: userMock.userId })
  })

  test('throws if user can not be found', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const getUserById = getUserByIdCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1GetUserByIdInputPayload = undefined

    const userMock: User = {
      email: 'email@example.com',
      name: 'test user',
      password: 'password',
      userId: 'a5fef052-911c-472c-ac25-e2da327f0af5',
    }

    const parameter: UserV1GetUserByIdInputParameter = {
      userId: userMock.userId,
    }

    const context = getCommandContextMock(payload, parameter, sandbox)

    context.stubs.getState.resolves({ [StateStoreKey.Users]: [] })

    await expect(getUserById(context.mock, payload, parameter)).rejects.toThrow('user could not be found')
  })
})
