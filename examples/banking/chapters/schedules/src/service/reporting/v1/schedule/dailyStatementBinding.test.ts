import {
	getCustomMessageMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	getQueueBridgeMock,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, expect, test } from 'vitest'
import { reportingV1Service } from '../reportingV1Service.js'
import { dailyStatementDueEventName } from './dailyStatementOccurrence.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const occurrence = {
	id: 'daily:2026-09-02:account-operating',
	scheduledFor: '2026-09-02T04:00:00.000Z',
	accountId: 'account-operating',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
}

async function setup() {
	const eventBridge = getEventBridgeMock(sandbox)
	const queueBridge = getQueueBridgeMock(sandbox)
	const service = await reportingV1Service.getInstance(eventBridge.mock, {
		logger: getLoggerMock(sandbox).mock,
		queueBridge: queueBridge.mock,
	})
	await service.start()
	const registration = eventBridge.stubs.registerSubscription.args.find(
		([subscription]) => subscription.eventName === dailyStatementDueEventName,
	)
	if (!registration) throw new Error('Expected the event-to-queue subscription')
	const deliver = registration[1] as (message: ReturnType<typeof getCustomMessageMessageMock>) => Promise<void>
	return { service, queueBridge, deliver }
}

function message() {
	return getCustomMessageMessageMock(dailyStatementDueEventName, occurrence, {
		principalId: 'principal-alex',
		tenantId: 'tenant-example',
	})
}

test('maps one validated occurrence and trusted identity to the queue', async () => {
	const fixture = await setup()
	try {
		await fixture.deliver(message())
		expect(fixture.queueBridge.stubs.enqueue.calledOnce).toBe(true)
		expect(fixture.queueBridge.stubs.enqueue.firstCall.args[0]).toMatchObject({
			queueName: 'generateStatement',
			payload: {
				accountId: occurrence.accountId,
				transactionId: occurrence.transactionId,
			},
			idempotencyKey: occurrence.id,
			headers: {
				'purista.principalId': 'principal-alex',
				'purista.tenantId': 'tenant-example',
				'purista.sourceEventName': dailyStatementDueEventName,
			},
		})
	} finally {
		await fixture.service.destroy()
	}
})

test('keeps repeated delivery visible in advisory mode', async () => {
	const fixture = await setup()
	try {
		await fixture.deliver(message())
		await fixture.deliver(message())
		expect(fixture.queueBridge.stubs.enqueue.callCount).toBe(2)
		expect(fixture.queueBridge.stubs.enqueue.firstCall.args[0].idempotencyKey).toBe(occurrence.id)
		expect(fixture.queueBridge.stubs.enqueue.secondCall.args[0].idempotencyKey).toBe(occurrence.id)
	} finally {
		await fixture.service.destroy()
	}
})

test('returns retry intent when enqueueing fails', async () => {
	const fixture = await setup()
	try {
		fixture.queueBridge.stubs.enqueue.rejects(new Error('queue unavailable'))
		await expect(fixture.deliver(message())).rejects.toMatchObject({
			name: 'SubscriptionConsumerControlError',
			outcome: 'retry',
			reason: 'daily_statement_enqueue_failed',
			delayMs: 250,
		})
	} finally {
		await fixture.service.destroy()
	}
})
