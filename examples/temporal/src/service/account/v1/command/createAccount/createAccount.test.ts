import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { accountV1Service } from '../../accountV1Service.js'
import { createAccountCommandBuilder } from './createAccountCommandBuilder.js'
import type { AccountV1CreateAccountInputParameter, AccountV1CreateAccountInputPayload } from './types.js'

describe('service Account version 1 - command createAccount', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await accountV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const createAccount = safeBind(createAccountCommandBuilder.getCommandFunction(), service)

		const payload: AccountV1CreateAccountInputPayload = undefined

		const parameter: AccountV1CreateAccountInputParameter = {}

		const context = createAccountCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })

		const result = await createAccount(context.mock, payload, parameter)

		expect(result).toBeUndefined()
	})
})
