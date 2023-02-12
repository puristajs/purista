import { CommandErrorResponse, EBMessageType, StatusCode } from '../types'
import { HandledError } from './HandledError.impl'
import { UnhandledError } from './UnhandledError.impl'

describe('UnhandledError', () => {
  const sender = {
    serviceName: 'SenderService',
    serviceVersion: '1.1.1',
    serviceTarget: 'senderServiceTarget',
  }

  const receiver = {
    serviceName: 'ReceiverService',
    serviceVersion: '2.2.2',
    serviceTarget: 'receiverServiceTarget',
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

  it('creates a new UnhandledError', () => {
    const statusCode = StatusCode.BadRequest
    const message = 'invalid input'
    const data = { some: 'data' }
    const traceId = 'messageTraceId'

    const commandErrorResponse: CommandErrorResponse = {
      messageType: EBMessageType.CommandErrorResponse,
      isHandledError: false,
      id: 'messageTestId',
      instanceId: 'myInstance',
      traceId,
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      sender,
      receiver,
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
})
