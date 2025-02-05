import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import type { User } from '../../../../../types/index.js'
import { StateStoreKey } from '../../../../../types/index.js'
import { userV1Service } from '../../userV1Service.js'
import { getAllUsersCommandBuilder } from './getAllUsersCommandBuilder.js'
import type { UserV1GetAllUsersInputParameter, UserV1GetAllUsersInputPayload } from './types.js'

describe('service User version 1 - command getAllUsers', () => {
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

		const getAllUsers = safeBind(getAllUsersCommandBuilder.getCommandFunction(), service)

		const payload: UserV1GetAllUsersInputPayload = undefined

		const parameter: UserV1GetAllUsersInputParameter = {}

		const context = getAllUsersCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })

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
