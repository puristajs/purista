import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
	validate,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import type { TransactionRepository } from '../../TransactionRepository.js'
import { transactionTestResources } from '../../testing/transactionTestResources.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import { recordingStartedEventName, recordingStartedEventSchema } from './recordingStartedEvent.js'
import { recordTransactionCommandBuilder } from './recordTransactionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const input = { amountCents: 2599, direction: 'debit' as const, counterparty: 'Northwind Books' }
const parameter = { accountId: 'account-operating' }

describe('recordTransaction custom event', () => {
	test('emits one distinct started fact before saving', async () => {
		const save = sandbox.stub().resolves({
			...input, ...parameter, tenantId: 'tenant-example',
			transactionId: crypto.randomUUID(), recordedAt: new Date().toISOString(),
		})
		const transactionRepository: TransactionRepository = { save, findById: sandbox.stub() }
		const resources = transactionTestResources(transactionRepository)
		const service = await transactionV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			resources,
		})
		try {
			const { context, stubs } = createCommandContextMock(recordTransactionCommandBuilder, {
				payload: input, parameter, resources, sandbox,
			})
			context.message = getCommandMessageMock({
				principalId: 'principal-alex', tenantId: 'tenant-example',
				payload: { payload: input, parameter },
			})
			const handler = safeBind(recordTransactionCommandBuilder.getCommandFunction(), service)
			await handler(context, input, parameter)

			expect(stubs.emit[recordingStartedEventName].calledOnceWith(
				recordingStartedEventName,
				{ accountId: 'account-operating' },
			)).toBe(true)
			expect(save.calledOnce).toBe(true)
		} finally {
			await service.destroy()
		}
	})

	test('keeps the declared custom-event schema on the builder', async () => {
		const definition = await recordTransactionCommandBuilder.getDefinition()
		expect((definition.emitList as Record<string, unknown>)[recordingStartedEventName])
			.toBe(recordingStartedEventSchema)
		const valid = await validate(recordingStartedEventSchema, {
			accountId: 'account-operating',
		})
		const invalid = await validate(recordingStartedEventSchema, {
			accountId: '',
		})

		expect(valid.success).toBe(true)
		expect(invalid.success).toBe(false)
	})
})
