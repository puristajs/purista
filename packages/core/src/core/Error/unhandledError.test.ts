import type { CommandErrorResponse } from '../types/index.js'
import { EBMessageType, StatusCode } from '../types/index.js'
import { HandledError } from './HandledError.impl.js'
import { UnhandledError } from './UnhandledError.impl.js'

describe('UnhandledError', () => {
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

	it('creates a new UnhandledError', () => {
		const statusCode = StatusCode.BadRequest
		const message = 'invalid input'
		const data = { some: 'data' }
		const traceId = 'messageTraceId'

		const error = new UnhandledError(statusCode, message, data, traceId)

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

	it('creates a UnhandledError from error', () => {
		const statusCode = StatusCode.BadRequest
		const message = 'invalid input'
		const data = { some: 'data' }
		const traceId = 'messageTraceId'

		const commandErrorResponse: CommandErrorResponse = {
			messageType: EBMessageType.CommandErrorResponse,
			isHandledError: false,
			id: 'messageTestId',
			traceId,
			timestamp: Date.now(),
			correlationId: 'messageCorrelationId',
			principalId: 'messagePrincipalId',
			tenantId: 'messageTenantId',
			sender,
			receiver,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			payload: {
				status: statusCode,
				message,
				data,
			},
		}

		const error = UnhandledError.fromMessage(commandErrorResponse)

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

	it('returns a HandledError from UnhandledError', () => {
		const statusCode = StatusCode.BadRequest
		const message = 'invalid input'
		const data = { some: 'data' }
		const traceId = 'messageTraceId'

		const unhandledError = new UnhandledError(statusCode, message, data, traceId)

		const error = unhandledError.intoHandledError()

		expect(error).toBeInstanceOf(HandledError)
		expect(error.data).toEqual(data)
		expect(error.message).toEqual(message)
		expect(error.errorCode).toEqual(statusCode)
		expect(error.traceId).toEqual(traceId)
	})

	it('creates UnhandledError from unknown input', () => {
		const error = UnhandledError.fromError('boom', StatusCode.BadRequest, { some: 'data' })

		expect(error).toBeInstanceOf(UnhandledError)
		expect(error.message).toBe('boom')
		expect(error.errorCode).toBe(StatusCode.BadRequest)
		expect(error.data).toStrictEqual({ some: 'data' })
	})

	it('keeps trace id when converting from another Purista error', () => {
		const source = new HandledError(StatusCode.BadRequest, 'invalid input', undefined, 'trace-123')
		const error = UnhandledError.fromError(source)

		expect(error.traceId).toBe('trace-123')
	})
})
