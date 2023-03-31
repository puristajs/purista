import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { StateStoreKey, User } from '../../../../../types'
import { userV1Service } from '../../userV1Service'
import { getAllUsersCommandBuilder } from './getAllUsersCommandBuilder'
import { UserV1GetAllUsersInputParameter, UserV1GetAllUsersInputPayload } from './types'

describe('service User version 1 - command getAllUsers', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const getAllUsers = getAllUsersCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1GetAllUsersInputPayload = undefined

    const parameter: UserV1GetAllUsersInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const userMock: User = {
      email: 'email@example.com',
      name: 'test user',
      password: 'password',
      userId: 'a5fef052-911c-472c-ac25-e2da327f0af5',
    }

    context.stubs.getState.resolves({
      [StateStoreKey.Users]: [userMock],
    })

    const result = await getAllUsers(context.mock, payload, parameter)

    expect(result).toStrictEqual([{ name: userMock.name, email: userMock.email, userId: userMock.userId }])
  })
})
