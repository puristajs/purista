import { EBMessageType, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { monitoringV1Service } from '../../monitoringV1Service.js'
import { observeLargeDebitSubscriptionBuilder } from './observeLargeDebitSubscriptionBuilder.js'

test('registers one narrowly matched subscription', async () => {
	const definition = await observeLargeDebitSubscriptionBuilder.getDefinition()
	expect(definition.eventName).toBe(ServiceEvent.TransactionRecordedV1)
	expect(definition.messageType).toBe(EBMessageType.CommandSuccessResponse)
	expect(definition.sender).toEqual({
		serviceName: 'Transaction',
		serviceVersion: '1',
		serviceTarget: 'recordTransaction',
		instanceId: undefined,
	})
	expect(definition.tenantId).toBe('tenant-example')

	const sandbox = createSandbox()
	const bridge = getEventBridgeMock(sandbox)
	const service = await monitoringV1Service.getInstance(bridge.mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		await service.start()
		expect(bridge.stubs.registerSubscription.calledOnce).toBe(true)
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
