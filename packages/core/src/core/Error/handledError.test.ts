import type { CommandErrorResponse } from '../types/index.js'
import { EBMessageType, StatusCode } from '../types/index.js'
import { HandledError } from './HandledError.impl.js'

describe('HandledError', () => {
	const sender = {
		serviceName: 'SenderService',
		serviceVersion: '1.1.1',
		serviceTarget: 'senderServiceTarget',
		instanceId: 'a',
	}

	const receiver = {
		serviceName: 'ReceiverService',
		serviceVersion: '2.2.2',
		serviceTarget: 'receiverServiceTarget',
		instanceId: 'a',
	}

	it('creates a new HandledError', () => {
		const statusCode = StatusCode.BadRequest
		const message = 'invalid input'
		const data = { some: 'data' }
		const traceId = 'messageTraceId'

		const error = new HandledError(statusCode, message, data, traceId)

		const response = error.getErrorResponse()

		expect(response.data).toEqual(data)
		expect(response.message).toEqual(message)
		expect(response.status).toEqual(statusCode)
		expect(response.traceId).toEqual(traceId)

		const strResponse = error.toString()
		const result = JSON.parse(strResponse)

		expect(result.data).toEqual(data)
		expect(result.message).toEqual(message)
		expect(result.status).toEqual(statusCode)
		expect(result.traceId).toEqual(traceId)
	})

	it('creates a HandledError from error', () => {
		const statusCode = StatusCode.BadRequest
		const message = 'invalid input'
		const data = { some: 'data' }
		const traceId = 'messageTraceId'

		const commandErrorResponse: CommandErrorResponse = {
			messageType: EBMessageType.CommandErrorResponse,
			isHandledError: true,
			id: 'messageTestId',
			traceId,
			timestamp: Date.now(),
			correlationId: 'messageCorrelationId',
			principalId: 'messagePrincipalId',
			tenantId: 'messageTenantId',
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			sender,
			receiver,
			payload: {
				status: statusCode,
				message,
				data,
			},
		}

		const error = HandledError.fromMessage(commandErrorResponse)

		const response = error.getErrorResponse()

		expect(response.data).toEqual(data)
		expect(response.message).toEqual(message)
		expect(response.status).toEqual(statusCode)
		expect(response.traceId).toEqual(traceId)

		const strResponse = error.toString()
		const result = JSON.parse(strResponse)

		expect(result.data).toEqual(data)
		expect(result.message).toEqual(message)
		expect(result.status).toEqual(statusCode)
		expect(result.traceId).toEqual(traceId)
	})
})
