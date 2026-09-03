import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { reportingJobStateKey } from '../../reportingJobState.js'
import { reportingV1Service } from '../../reportingV1Service.js'
import { getStatementStatusCommandBuilder } from './getStatementStatusCommandBuilder.js'

const jobId = 'job-1'
const parameter = { jobId }
const record = {
	jobId, queueName: 'generateStatement', status: 'success' as const, attempt: 1,
	updatedAt: 1, tenantId: 'tenant-example', principalId: 'principal-alex',
	result: {
		accountId: 'account-operating',
		transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
		amountCents: 2599, direction: 'debit', counterparty: 'Northwind Books',
		generatedAt: '2026-09-01T10:00:00.000Z',
	},
}

test('returns the owned completed result from StateStore', async () => {
	const sandbox = createSandbox()
	const service = await reportingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		const { context, stubs } = createCommandContextMock(getStatementStatusCommandBuilder, {
			payload: undefined, parameter, sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example', principalId: 'principal-alex',
			payload: { payload: undefined, parameter },
		})
		stubs.getState.resolves({ [reportingJobStateKey(jobId)]: record })
		const guard = safeBind(getStatementStatusCommandBuilder.getBeforeGuardHook('jobOwner'), service)
		await expect(guard(context, undefined, parameter)).resolves.toBeUndefined()
		const command = safeBind(getStatementStatusCommandBuilder.getCommandFunction(), service)
		await expect(command(context, undefined, parameter)).resolves.toEqual({
			jobId, status: 'success', statement: record.result,
		})
	} finally { await service.destroy(); sandbox.restore() }
})

test('does not expose another principal job result', async () => {
	const sandbox = createSandbox()
	const service = await reportingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		const { context, stubs } = createCommandContextMock(getStatementStatusCommandBuilder, {
			payload: undefined, parameter, sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example', principalId: 'principal-other',
			payload: { payload: undefined, parameter },
		})
		stubs.getState.resolves({ [reportingJobStateKey(jobId)]: record })
		const guard = safeBind(getStatementStatusCommandBuilder.getBeforeGuardHook('jobOwner'), service)
		await expect(guard(context, undefined, parameter)).rejects.toMatchObject({ errorCode: 403 })
	} finally { await service.destroy(); sandbox.restore() }
})
