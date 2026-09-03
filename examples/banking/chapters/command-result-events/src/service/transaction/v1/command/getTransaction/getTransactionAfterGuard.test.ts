import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionTestResources } from '../../testing/transactionTestResources.js'
import { transactionSchema } from '../../transaction.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { getTransactionCommandBuilder } from './getTransactionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const parameter = {
	accountId: 'account-operating',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
}

async function setup() {
	const transactionRepository: TransactionRepository = {
		save: sandbox.stub(),
		findById: sandbox.stub(),
	}
	const resources = transactionTestResources(transactionRepository)
	const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		resources,
	})
	const mocked = createCommandContextMock(getTransactionCommandBuilder, {
		payload: undefined,
		parameter,
		resources,
		sandbox,
	})
	mocked.context.message = getCommandMessageMock({
		principalId: 'principal-alex',
		tenantId: 'tenant-example',
		payload: { payload: undefined, parameter },
	})
	const hook = getTransactionCommandBuilder.getAfterGuardHook('returnedTransactionScope')
	if (!hook) throw new Error('Expected returnedTransactionScope guard')
	return { guard: safeBind(hook, service), context: mocked.context, service }
}

const transaction = transactionSchema.parse({
	accountId: 'account-operating',
	tenantId: 'tenant-example',
	transactionId: parameter.transactionId,
	amountCents: 2599,
	direction: 'debit',
	counterparty: 'Northwind Books',
	recordedAt: '2026-09-01T10:00:00.000Z',
})

describe('getTransaction after guard', () => {
	test('accepts the requested account and trusted tenant', async () => {
		const fixture = await setup()
		try {
			await expect(fixture.guard(fixture.context, transaction, undefined, parameter)).resolves.toBeUndefined()
		} finally {
			await fixture.service.destroy()
		}
	})

	test('denies a schema-valid transaction from another account', async () => {
		const fixture = await setup()
		try {
			const foreign = transactionSchema.parse({ ...transaction, accountId: 'account-review' })
			await expect(fixture.guard(fixture.context, foreign, undefined, parameter))
				.rejects.toThrow('Account action is not allowed')
		} finally {
			await fixture.service.destroy()
		}
	})
})
