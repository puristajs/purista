import {
	DefaultSecretStore,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	isCommandErrorResponse,
	isCommandSuccessResponse,
	StatusCode,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { localAccountAccessPolicy } from '../../AccountAccessPolicy.js'
import type { LegacyTransactionClient } from '../../LegacyTransactionClient.js'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionV1Service } from '../../transactionV1Service.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const parameter = { accountId: 'account-operating', sourceId: 'provider-1001' }
const stored = {
	accountId: 'account-operating',
	tenantId: 'tenant-example',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
	recordedAt: '2026-09-01T10:00:00.000Z',
	amountCents: 2599,
	direction: 'debit' as const,
	counterparty: 'Northwind Books',
	reference: 'Provider 1001',
}

async function setup(principalId: string, token?: string, record = 'debit|25.99|Northwind Books|Provider 1001') {
	const fetchTransaction = sandbox.stub().resolves(record)
	const legacyTransactionClient: LegacyTransactionClient = { fetchTransaction }
	const save = sandbox.stub().resolves(stored)
	const transactionRepository: TransactionRepository = { save, findById: sandbox.stub() }
	const logger = getLoggerMock(sandbox).mock
	const secretStore = new DefaultSecretStore({
		logger,
		config: token ? { legacyProviderToken: token } : {},
	})
	const service = await transactionV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger,
		resources: { transactionRepository, accountAccessPolicy: localAccountAccessPolicy, legacyTransactionClient },
		secretStore,
	})
	await service.start()
	const message = getCommandMessageMock({
		principalId,
		tenantId: 'tenant-example',
		receiver: {
			serviceName: 'Transaction',
			serviceVersion: '1',
			serviceTarget: 'importProviderTransaction',
		},
		payload: { payload: {}, parameter },
	})
	return { service, secretStore, message, fetchTransaction, save }
}

async function destroy(fixture: Awaited<ReturnType<typeof setup>>) {
	await fixture.service.destroy()
	await fixture.secretStore.destroy()
}

describe('importProviderTransaction command', () => {
	test('uses the injected client and saves validated provider data', async () => {
		const fixture = await setup('principal-alex', 'fixture-token')
		try {
			const response = await fixture.service.executeCommand(fixture.message)
			expect(isCommandSuccessResponse(response)).toBe(true)
			expect(response.payload).toEqual(stored)
			expect(fixture.fetchTransaction.calledOnceWith('provider-1001', 'fixture-token')).toBe(true)
			expect(fixture.save.calledOnceWith({
				accountId: 'account-operating',
				tenantId: 'tenant-example',
				amountCents: 2599,
				direction: 'debit',
				counterparty: 'Northwind Books',
				reference: 'Provider 1001',
			})).toBe(true)
		} finally {
			await destroy(fixture)
		}
	})

	test('denies the business action before secrets, provider, and repository effects', async () => {
		const fixture = await setup('principal-sam', 'fixture-token')
		const getSecret = sandbox.spy(fixture.secretStore, 'getSecret')
		try {
			const response = await fixture.service.executeCommand(fixture.message)
			expect(isCommandErrorResponse(response)).toBe(true)
			if (!isCommandErrorResponse(response)) throw new Error('Expected a command error response')
			expect(response.payload.status).toBe(StatusCode.Forbidden)
			expect(getSecret.called).toBe(false)
			expect(fixture.fetchTransaction.called).toBe(false)
			expect(fixture.save.called).toBe(false)
		} finally {
			await destroy(fixture)
		}
	})

	test('does not call the provider when its token is missing', async () => {
		const fixture = await setup('principal-alex')
		try {
			const response = await fixture.service.executeCommand(fixture.message)
			expect(isCommandErrorResponse(response)).toBe(true)
			if (!isCommandErrorResponse(response)) throw new Error('Expected a command error response')
			expect(response.payload.status).toBe(StatusCode.ServiceUnavailable)
			expect(fixture.fetchTransaction.called).toBe(false)
			expect(fixture.save.called).toBe(false)
		} finally {
			await destroy(fixture)
		}
	})

	test('does not save malformed provider content', async () => {
		const fixture = await setup('principal-alex', 'fixture-token', 'debit|25.99|A')
		try {
			const response = await fixture.service.executeCommand(fixture.message)
			expect(isCommandErrorResponse(response)).toBe(true)
			if (!isCommandErrorResponse(response)) throw new Error('Expected a command error response')
			expect(response.payload.status).toBe(StatusCode.BadGateway)
			expect(fixture.save.called).toBe(false)
		} finally {
			await destroy(fixture)
		}
	})
})
