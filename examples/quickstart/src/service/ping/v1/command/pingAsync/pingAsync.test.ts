import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { pingAsyncCommandBuilder } from './pingAsyncCommandBuilder.js'
import type { PingV1PingAsyncInputParameter, PingV1PingAsyncInputPayload } from './types.js'

describe('service Ping version 1 - command pingAsync', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('enqueues a ping job', async () => {
		const service = await pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const handler = safeBind(pingAsyncCommandBuilder.getCommandFunction(), service)

		const payload: PingV1PingAsyncInputPayload = { ping: 'async ping' }
		const parameter: PingV1PingAsyncInputParameter = { requestId: 'req-123' }

		const context = pingAsyncCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })
		context.stubs.enqueue.resolves({ jobId: 'job-1', queueName: 'pingJob' })

		const result = await handler(context.mock, payload, parameter)

		expect(result).toStrictEqual({ jobId: 'job-1', queueName: 'pingJob', scheduledAt: undefined })
		expect(context.stubs.enqueue.callCount).toBe(1)
	})
})
