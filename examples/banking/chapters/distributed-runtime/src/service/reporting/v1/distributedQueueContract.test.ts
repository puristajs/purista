import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { requestSnapshotCommandBuilder } from './command/requestSnapshot/requestSnapshotCommandBuilder.js'
import { generateSnapshotQueueBuilder } from './queue/generateSnapshot/generateSnapshotQueueBuilder.js'
import { reportingV1Service } from './reportingV1Service.js'

const transactionId = '3bd00f72-8db0-4f39-875d-fd5e251a7f32'

test('requests FIFO delivery from the selected queue bridge', async () => {
	const definition = await generateSnapshotQueueBuilder.getDefinition()
	expect(definition.queueBridgeConfig).toEqual({ orderingGuarantee: 'fifo', prefetch: 1 })
})

test('passes a stable idempotency key through the PURISTA queue context', async () => {
	const sandbox = createSandbox()
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
		await command(mocked.context, { transactionId }, {})
		expect(mocked.stubs.enqueue.calledOnceWith(
			'generateSnapshot', { transactionId }, {},
			sandbox.match({ idempotencyKey: `snapshot-${transactionId}` }),
		)).toBe(true)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
