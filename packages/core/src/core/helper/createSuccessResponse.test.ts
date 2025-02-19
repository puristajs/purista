import type { Command } from '../types/index.js'
import { EBMessageType } from '../types/index.js'
import { createSuccessResponse } from './createSuccessResponse.impl.js'

describe('createSuccessResponse', () => {
	it('creates a success response', () => {
		const payload = { content: 'result content' }

		const message: Command = {
			messageType: EBMessageType.Command,
			id: 'messageTestId',
			traceId: 'testTraceId',
			timestamp: Date.now(),
			correlationId: 'messageCorrelationId',
			principalId: 'messagePrincipalId',
			tenantId: 'messageTenantId',
			sender: {
				serviceName: 'SenderService',
				serviceVersion: '1.1.1',
				serviceTarget: 'senderServiceTarget',
				instanceId: 'SenderServiceInstance',
			},
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			receiver: {
				serviceName: 'ReceiverService',
				serviceVersion: '2.2.2',
				serviceTarget: 'receiverServiceTarget',
				instanceId: 'ReceiverServiceInstance',
			},
			payload: {
				payload: { input: 'input payload' },
				parameter: { input: 'parameter' },
			},
		}

		const result = createSuccessResponse('ReceiverServiceInstance', message, payload)

		expect(result.messageType).toBe(EBMessageType.CommandSuccessResponse)
		expect(result.payload).toBe(payload)
		expect(result.sender).toStrictEqual(message.receiver)
		expect(result.receiver).toStrictEqual(message.sender)
		expect(result.traceId).toBe(message.traceId)
		expect(result.correlationId).toBe(message.correlationId)
		expect(result.tenantId).toBe(message.tenantId)
		expect(result.principalId).toBe(message.principalId)
		expect(result.id).toBe(message.id)
	})

	it('adds a trace id', () => {
		const payload = { content: 'result content' }

		const message: Command = {
			messageType: EBMessageType.Command,
			id: 'messageTestId',
			timestamp: Date.now(),
			correlationId: 'messageCorrelationId',
			principalId: 'messagePrincipalId',
			tenantId: 'messageTenantId',
			sender: {
				serviceName: 'SenderService',
				serviceVersion: '1.1.1',
				serviceTarget: 'senderServiceTarget',
				instanceId: 'SenderServiceInstance',
			},
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			receiver: {
				serviceName: 'ReceiverService',
				serviceVersion: '2.2.2',
				serviceTarget: 'receiverServiceTarget',
				instanceId: 'ReceiverServiceInstance',
			},
			payload: {
				payload: { input: 'input payload' },
				parameter: { input: 'parameter' },
			},
		}

		const result = createSuccessResponse('ReceiverServiceInstance', message, payload)

		expect(result.messageType).toBe(EBMessageType.CommandSuccessResponse)
		expect(result.payload).toBe(payload)
		expect(result.sender).toStrictEqual(message.receiver)
		expect(result.receiver).toStrictEqual(message.sender)
		expect(result.traceId).toBeDefined()
	})
})
