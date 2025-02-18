import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingPongV1Service } from '../../pingPongV1Service.js'
import { pongCommandBuilder } from './pongCommandBuilder.js'
import type { PingPongV1PongInputParameter, PingPongV1PongInputPayload } from './types.js'

describe('service Ping Pong version 1 - command pong', () => {
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

		const pong = safeBind(pongCommandBuilder.getCommandFunction(), service)

		const payload: PingPongV1PongInputPayload = { pongMessage: 'PING!' }

		const parameter: PingPongV1PongInputParameter = {}

		const context = pongCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })

		const result = await pong(context.mock, payload, parameter)

		expect(result).toBe('PING! -> PONG!')
	})
})
