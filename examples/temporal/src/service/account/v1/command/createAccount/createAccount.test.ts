import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { accountV1Service } from '../../accountV1Service.js'
import { createAccountCommandBuilder } from './createAccountCommandBuilder.js'

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

		const payload: Parameters<typeof createAccount>[1] = {}

		const parameter: Parameters<typeof createAccount>[2] = {}

		const context = createCommandContextMock(createAccountCommandBuilder, { payload, parameter, sandbox })

		const result = await createAccount(context.mock, payload, parameter)

		expect(result).toBeUndefined()
	})
})
