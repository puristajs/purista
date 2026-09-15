import {
	createCommandContextMock,
	getCommandMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	isHttpExposedServiceMeta,
	safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, expect, test } from 'vitest'
import { reportingV1Service } from '../../reportingV1Service.js'
import { dailyStatementDueEventName } from '../../schedule/dailyStatementOccurrence.js'
import { triggerDailyStatementCommandBuilder } from './triggerDailyStatementCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

const occurrence = {
	id: 'daily:2026-09-02:account-operating',
	scheduledFor: '2026-09-02T04:00:00.000Z',
	accountId: 'account-operating',
	transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
}

async function setup(principalId: string) {
	const service = await reportingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	const mocked = createCommandContextMock(triggerDailyStatementCommandBuilder, {
		payload: occurrence,
		parameter: {},
		sandbox,
	})
	mocked.context.message = getCommandMessageMock({
		tenantId: 'tenant-example',
		principalId,
		payload: { payload: occurrence, parameter: {} },
	})
	return { service, ...mocked }
}

test('declares one protected generated endpoint and one custom event', async () => {
	const definition = await triggerDailyStatementCommandBuilder.getDefinition()
	expect(isHttpExposedServiceMeta(definition.metadata)).toBe(true)
	if (!isHttpExposedServiceMeta(definition.metadata)) throw new Error('Expected HTTP metadata')
	expect(definition.metadata.expose.http).toMatchObject({
		method: 'POST',
		path: 'reports/statements/daily-trigger',
		openApi: { isSecure: true },
	})
	expect(Object.keys(definition.emitList)).toEqual([dailyStatementDueEventName])
})

test('emits the validated fixed occurrence for an allowed account', async () => {
	const fixture = await setup('principal-alex')
	try {
		const guard = safeBind(
			triggerDailyStatementCommandBuilder.getBeforeGuardHook('accountMayRunDailyStatement'),
			fixture.service,
		)
		await expect(guard(fixture.context, occurrence, {})).resolves.toBeUndefined()
		const handler = safeBind(triggerDailyStatementCommandBuilder.getCommandFunction(), fixture.service)
		await expect(handler(fixture.context, occurrence, {})).resolves.toEqual({ occurrenceId: occurrence.id })
		expect(fixture.stubs.emit[dailyStatementDueEventName].calledOnceWith(
			dailyStatementDueEventName,
			occurrence,
		)).toBe(true)
	} finally {
		await fixture.service.destroy()
	}
})

test('denies the account action before the event is emitted', async () => {
	const fixture = await setup('principal-other')
	try {
		const guard = safeBind(
			triggerDailyStatementCommandBuilder.getBeforeGuardHook('accountMayRunDailyStatement'),
			fixture.service,
		)
		await expect(guard(fixture.context, occurrence, {})).rejects.toMatchObject({ errorCode: 403 })
		expect(fixture.stubs.emit[dailyStatementDueEventName].called).toBe(false)
	} finally {
		await fixture.service.destroy()
	}
})
