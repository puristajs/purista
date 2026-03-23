import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { emailV1Service } from '../../emailV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'

describe('service Email version 1 - command ping', () => {
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

		const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

		const payload: Parameters<typeof ping>[1] = 'input value'

		const parameter: Parameters<typeof ping>[2] = {}

		const context = createCommandContextMock(pingCommandBuilder, { payload, parameter, sandbox })

		const result = await ping(context.mock, payload, parameter)

		expect(result).toStrictEqual({ pong: 'input value' })
	})
})
