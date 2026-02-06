import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingPongV1Service } from '../../pingPongV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'

describe('service Ping Pong version 1 - command ping', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await pingPongV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

		const payload: Parameters<typeof ping>[1] = undefined

		const parameter: Parameters<typeof ping>[2] = {}

		const context = pingCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })

		const result = await ping(context.mock, payload, parameter)

		expect(result).toBe('PING!')
	})
})
