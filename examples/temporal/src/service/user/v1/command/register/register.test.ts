import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { vi } from 'vitest'

import { userV1Service } from '../../userV1Service.js'
import { registerCommandBuilder } from './registerCommandBuilder.js'
import type { UserV1RegisterInputParameter, UserV1RegisterInputPayload } from './types.js'

vi.mock('@temporalio/client', async importOriginal => {
	return {
		...(await importOriginal<Record<string, unknown>>()),
		Connection: {
			connect: () => {},
		},
		Client: class ClientMock {
			public workflow = {
				start: async () => ({ workflowId: 'the_workflowId' }),
			}
		},
	}
})

describe('service User version 1 - command register', () => {
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

		const register = safeBind(registerCommandBuilder.getCommandFunction(), service)

		const payload: UserV1RegisterInputPayload = {
			name: 'John Doe',
			email: 'john@example.com',
		}

		const parameter: UserV1RegisterInputParameter = {}

		const context = registerCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

		context.stubs.getState.resolves({})
		context.stubs.setState.resolves()

		const result = await register(context.mock, payload, parameter)

		expect(result).toStrictEqual({
			workflowId: 'the_workflowId',
		})
	})
})
