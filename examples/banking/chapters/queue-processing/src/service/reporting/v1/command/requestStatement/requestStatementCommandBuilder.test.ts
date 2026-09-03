import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	isHttpExposedServiceMeta,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { reportingV1Service } from '../../reportingV1Service.js'
import { requestStatementCommandBuilder } from './requestStatementCommandBuilder.js'

const payload = {
	accountId: 'account-operating',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
}

test('declares a protected asynchronous HTTP command', async () => {
	const definition = await requestStatementCommandBuilder.getDefinition()
	expect(isHttpExposedServiceMeta(definition.metadata)).toBe(true)
	if (!isHttpExposedServiceMeta(definition.metadata)) throw new Error('Expected HTTP metadata')
	expect(definition.metadata.expose.http).toMatchObject({
		method: 'POST', path: 'reports/statements', mode: 'async', openApi: { isSecure: true },
	})
})

test('uses trusted message identity in queue metadata', async () => {
	const sandbox = createSandbox()
	const service = await reportingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		const { context, stubs } = createCommandContextMock(requestStatementCommandBuilder, {
			payload, parameter: {}, sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example', principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		stubs.enqueue.resolves({ jobId: 'job-1', queueName: 'generateStatement', scheduledAt: 1 })
		const command = safeBind(requestStatementCommandBuilder.getCommandFunction(), service)
		await expect(command(context, payload, {})).resolves.toEqual({
			jobId: 'job-1', queueName: 'generateStatement', scheduledAt: 1,
		})
		expect(stubs.enqueue.calledOnceWith(
			'generateStatement', payload, {},
			sandbox.match({
				idempotencyKey: `tenant-example:${payload.transactionId}`,
				headers: {
					'purista.tenantId': 'tenant-example',
					'purista.principalId': 'principal-alex',
				},
			}),
		)).toBe(true)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})

test('denies a valid user who may not request this account', async () => {
	const sandbox = createSandbox()
	const service = await reportingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		const { context } = createCommandContextMock(requestStatementCommandBuilder, { payload, parameter: {}, sandbox })
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example', principalId: 'principal-other',
			payload: { payload, parameter: {} },
		})
		const guard = safeBind(requestStatementCommandBuilder.getBeforeGuardHook('accountMayGenerateStatement'), service)
		await expect(guard(context, payload, {})).rejects.toMatchObject({ errorCode: 403 })
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
