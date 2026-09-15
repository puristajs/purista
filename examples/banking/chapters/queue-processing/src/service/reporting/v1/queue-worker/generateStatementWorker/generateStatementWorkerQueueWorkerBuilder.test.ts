import { HandledError, StatusCode, createQueueWorkerTestHarness } from '@purista/core'
import { expect, test, vi } from 'vitest'
import { reportingV1Service } from '../../reportingV1Service.js'
import { generateStatementWorkerQueueWorkerBuilder } from './generateStatementWorkerQueueWorkerBuilder.js'

const payload = {
	accountId: 'account-operating',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
}
const baseMessage = {
	id: 'job-1', queueName: 'generateStatement', payload, parameter: {},
	headers: { 'purista.tenantId': 'tenant-example', 'purista.principalId': 'principal-alex' },
	createdAt: Date.now(), attempt: 1, maxAttempts: 3,
	leaseExpiresAt: Date.now() + 60_000, leaseTtlMs: 60_000,
}

function jobStore() {
	return { get: vi.fn(), set: vi.fn().mockResolvedValue(undefined) }
}

test('invokes Transaction, stores a small result, and acknowledges', async () => {
	const store = jobStore()
	const harness = await createQueueWorkerTestHarness(reportingV1Service, generateStatementWorkerQueueWorkerBuilder, {
		queueJobStore: store,
	})
	harness.stubs.eventBridge?.invoke.resolves({
		transactionId: payload.transactionId, amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books',
		recordedAt: '2026-09-01T10:00:00.000Z',
	})
	try {
		const result = await harness.run(baseMessage)
		expect(result.ackCalls).toHaveLength(1)
		expect(result.nackCalls).toHaveLength(0)
		expect(store.set).toHaveBeenCalledWith(expect.objectContaining({
			jobId: 'job-1', status: 'success', tenantId: 'tenant-example', principalId: 'principal-alex',
			result: expect.objectContaining({ amountCents: 2599, accountId: 'account-operating' }),
		}), 15 * 60 * 1000)
	} finally { await harness.destroy() }
})

test('retries a temporary transaction lookup failure', async () => {
	const harness = await createQueueWorkerTestHarness(reportingV1Service, generateStatementWorkerQueueWorkerBuilder, {
		queueJobStore: jobStore(),
	})
	harness.stubs.eventBridge?.invoke.rejects(new Error('temporary bridge failure'))
	try {
		const result = await harness.run(baseMessage)
		expect(result.ackCalls).toHaveLength(0)
		expect(result.nackCalls).toHaveLength(1)
		expect(result.deadLetterCalls).toHaveLength(0)
	} finally { await harness.destroy() }
})

test('dead-letters a transaction that does not exist', async () => {
	const harness = await createQueueWorkerTestHarness(reportingV1Service, generateStatementWorkerQueueWorkerBuilder, {
		queueJobStore: jobStore(),
	})
	harness.stubs.eventBridge?.invoke.rejects(new HandledError(StatusCode.NotFound, 'missing'))
	try {
		const result = await harness.run(baseMessage)
		expect(result.ackCalls).toHaveLength(1)
		expect(result.deadLetterCalls).toHaveLength(1)
	} finally { await harness.destroy() }
})

test('checks account access again before doing work', async () => {
	const harness = await createQueueWorkerTestHarness(reportingV1Service, generateStatementWorkerQueueWorkerBuilder, {
		queueJobStore: jobStore(),
	})
	try {
		const result = await harness.run({
			...baseMessage,
			headers: { 'purista.tenantId': 'tenant-example', 'purista.principalId': 'principal-other' },
		})
		expect(result.nackCalls).toHaveLength(1)
		expect(harness.stubs.eventBridge?.invoke.called).toBe(false)
	} finally { await harness.destroy() }
})
