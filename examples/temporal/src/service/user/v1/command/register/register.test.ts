import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core/testing'
import { createSandbox } from 'sinon'
import { vi } from 'vitest'

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
		const { userV1Service } = await import('../../userV1Service.js')
		const { registerCommandBuilder } = await import('./registerCommandBuilder.js')
		const service = await userV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			serviceConfig: {
				taskQueue: 'example',
				namespace: 'example',
				connect: {
					address: 'example.com',
				},
			},
		})

		const register = safeBind(registerCommandBuilder.getCommandFunction(), service)

		const payload: UserV1RegisterInputPayload = {
			name: 'John Doe',
			email: 'john@example.com',
		}

		const parameter: UserV1RegisterInputParameter = {}

		const context = createCommandContextMock(registerCommandBuilder, { payload, parameter, sandbox })

		context.stubs.getState.resolves({})
		context.stubs.setState.resolves()

		const result = await register(context.mock, payload, parameter)

		expect(result).toStrictEqual({
			workflowId: 'the_workflowId',
		})
	})
})
