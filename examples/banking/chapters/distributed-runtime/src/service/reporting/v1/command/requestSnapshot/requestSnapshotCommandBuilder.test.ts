import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { reportingV1Service } from '../../reportingV1Service.js'
import { requestSnapshotCommandBuilder } from './requestSnapshotCommandBuilder.js'

test('returns the QueueBridge receipt for a typed snapshot request', async () => {
	const sandbox = createSandbox()
	const transactionId = '3bd00f72-8db0-4f39-875d-fd5e251a7f32'
	const service = await reportingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		const mocked = createCommandContextMock(requestSnapshotCommandBuilder, {
			payload: { transactionId }, parameter: {}, sandbox,
		})
		mocked.stubs.enqueue.resolves({
			jobId: 'job-1', queueName: 'generateSnapshot', scheduledAt: 1,
		})
		const command = safeBind(requestSnapshotCommandBuilder.getCommandFunction(), service)
		await expect(command(mocked.context, { transactionId }, {})).resolves.toEqual({
			jobId: 'job-1', queueName: 'generateSnapshot', scheduledAt: 1,
		})
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
