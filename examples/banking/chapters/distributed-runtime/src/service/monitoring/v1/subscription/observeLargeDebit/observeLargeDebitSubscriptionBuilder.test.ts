import {
	createSubscriptionContextMock,
	getCommandSuccessMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, expect, test } from 'vitest'
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import {
	latestLargeDebitSignalKey,
} from '../../monitoringSignal.js'
import { monitoringV1Service } from '../../monitoringV1Service.js'
import { observeLargeDebitSubscriptionBuilder } from './observeLargeDebitSubscriptionBuilder.js'
import type { MonitoringV1ObserveLargeDebitInputPayload } from './types.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const qualifying = {
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
	accountId: 'account-operating',
	amountCents: 12_500,
	direction: 'debit' as const,
}

async function setup(payload: MonitoringV1ObserveLargeDebitInputPayload = qualifying) {
	const service = await monitoringV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	const message = getCommandSuccessMessageMock(payload, {
		eventName: ServiceEvent.TransactionRecordedV1,
		tenantId: 'tenant-example',
		sender: {
			serviceName: 'Transaction',
			serviceVersion: '1',
			serviceTarget: 'recordTransaction',
			instanceId: 'transaction-instance',
		},
	})
	const mocked = createSubscriptionContextMock(observeLargeDebitSubscriptionBuilder, {
		message,
		sandbox,
	})
	mocked.stubs.setState.resolves()
	const observe = safeBind(observeLargeDebitSubscriptionBuilder.getSubscriptionFunction(), service)
	return { service, mocked, observe }
}

test('stores one narrow signal for a qualifying debit', async () => {
	const fixture = await setup()
	try {
		await fixture.observe(fixture.mocked.context, qualifying, undefined)
		expect(fixture.mocked.stubs.setState.calledOnceWith(
			latestLargeDebitSignalKey,
			{
				transactionId: qualifying.transactionId,
				accountId: qualifying.accountId,
				amountCents: qualifying.amountCents,
			},
		)).toBe(true)
	} finally {
		await fixture.service.destroy()
	}
})

test('does not write for a credit or an amount below the threshold', async () => {
	for (const payload of [
		{ ...qualifying, direction: 'credit' as const },
		{ ...qualifying, amountCents: 9_999 },
	]) {
		const fixture = await setup(payload)
		try {
			await fixture.observe(fixture.mocked.context, payload, undefined)
			expect(fixture.mocked.stubs.setState.called).toBe(false)
		} finally {
			await fixture.service.destroy()
			sandbox.resetHistory()
		}
	}
})

test('replaces the same signal deterministically on repeated delivery', async () => {
	const fixture = await setup()
	try {
		await fixture.observe(fixture.mocked.context, qualifying, undefined)
		await fixture.observe(fixture.mocked.context, qualifying, undefined)
		expect(fixture.mocked.stubs.setState.callCount).toBe(2)
		expect(fixture.mocked.stubs.setState.firstCall.args).toEqual(
			fixture.mocked.stubs.setState.secondCall.args,
		)
	} finally {
		await fixture.service.destroy()
	}
})

test('surfaces a StateStore failure', async () => {
	const fixture = await setup()
	fixture.mocked.stubs.setState.rejects(new Error('state store unavailable'))
	try {
		await expect(fixture.observe(fixture.mocked.context, qualifying, undefined))
			.rejects.toThrow('state store unavailable')
	} finally {
		await fixture.service.destroy()
	}
})
