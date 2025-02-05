import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { UserV1PingInputParameter, UserV1PingInputPayload } from './types.js'

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

		const payload: UserV1PingInputPayload = undefined

		const parameter: UserV1PingInputParameter = {}

		const context = pingCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })

		context.stubs.service.User[1].computeData.resolves('invoke response')

		const result = await ping(context.mock, payload, parameter)

		expect(result).toStrictEqual({ pong: 'invoke response' })
	})
})
