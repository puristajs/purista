import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core/testing'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'

describe('service User version 1 - command ping', () => {
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

		const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

		const payload: Parameters<typeof ping>[1] = {}

		const parameter: Parameters<typeof ping>[2] = {}

		const context = createCommandContextMock(pingCommandBuilder, { payload, parameter, sandbox })

		context.stubs.service.User[1].computeData.resolves('invoke response')

		const result = await ping(context.mock, payload, parameter)

		expect(result).toStrictEqual({ pong: 'invoke response' })
	})
})
