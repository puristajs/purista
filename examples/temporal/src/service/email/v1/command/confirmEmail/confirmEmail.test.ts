import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { vi } from 'vitest'

import { emailV1Service } from '../../emailV1Service.js'
import { confirmEmailCommandBuilder } from './confirmEmailCommandBuilder.js'
import type { EmailV1ConfirmEmailInputParameter, EmailV1ConfirmEmailInputPayload } from './types.js'

vi.mock('@temporalio/client', async importOriginal => {
	return {
		...(await importOriginal<Record<string, unknown>>()),
		Connection: {
			connect: () => {},
		},
		Client: class ClientMock {
			public workflow = {
				getHandle: () => {
					return {
						signal: async () => {},
					}
				},
			}
		},
	}
})

describe('service Email version 1 - command confirmEmail', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await emailV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const confirmEmail = safeBind(confirmEmailCommandBuilder.getCommandFunction(), service)

		const payload: EmailV1ConfirmEmailInputPayload = {
			email: 'john@example.com',
		}

		const parameter: EmailV1ConfirmEmailInputParameter = {}

		const context = confirmEmailCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

		context.stubs.getState.resolves({ 'john@example.com': 'john@example.com' })

		const result = await confirmEmail(context.mock, payload, parameter)

		expect(result).toBeUndefined()
	})
})
