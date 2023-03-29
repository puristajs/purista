import { HandledError, UnhandledError } from '../Error'
import { Command, EBMessageType, StatusCode } from '../types'
import { createErrorResponse } from './createErrorResponse.impl'

describe('createErrorResponse', () => {
  const message: Command = {
    messageType: EBMessageType.Command,
    id: 'messageTestId',
    instanceId: 'myInstance',
    traceId: 'testTraceId',
    timestamp: Date.now(),
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    correlationId: 'messageCorrelationId',
    principalId: 'messagePrincipalId',
    sender: {
      serviceName: 'SenderService',
      serviceVersion: '1.1.1',
      serviceTarget: 'senderServiceTarget',
    },

    receiver: {
      serviceName: 'ReceiverService',
      serviceVersion: '2.2.2',
      serviceTarget: 'receiverServiceTarget',
    },
    payload: {
      payload: { input: 'input payload' },
      parameter: { input: 'parameter' },
    },
  }

  const statusCode = StatusCode.InternalServerError

  it('creates a error response', () => {
    const result = createErrorResponse(message, statusCode)

    const payload = { status: statusCode, message: 'Internal Server Error', traceId: message.traceId }

    expect(result.messageType).toBe(EBMessageType.CommandErrorResponse)
    expect(result.payload).toStrictEqual(payload)
    expect(result.sender).toStrictEqual(message.receiver)
    expect(result.receiver).toStrictEqual(message.sender)
    expect(result.traceId).toBe(message.traceId)
    expect(result.correlationId).toBe(message.correlationId)
    expect(result.id).toBe(message.id)
    expect(result.isHandledError).toBeFalsy()
  })

  it('creates a error response with HandledError', () => {
    const data = { some: 'additional data' }

    const messageText = 'invalid input - some fields missing'

    const error = new HandledError(StatusCode.BadRequest, messageText, data)

    const result = createErrorResponse(message, statusCode, error)

    const payload = { status: StatusCode.BadRequest, message: messageText, traceId: message.traceId, data }

    expect(result.messageType).toBe(EBMessageType.CommandErrorResponse)
    expect(result.payload).toStrictEqual(payload)
    expect(result.sender).toStrictEqual(message.receiver)
    expect(result.receiver).toStrictEqual(message.sender)
    expect(result.traceId).toBe(message.traceId)
    expect(result.correlationId).toBe(message.correlationId)
    expect(result.id).toBe(message.id)
    expect(result.isHandledError).toBeTruthy()
  })

  it('creates a error response with UnhandledError', () => {
    const data = { some: 'additional data' }

    const messageText = 'invalid input - some fields missing'

    const error = new UnhandledError(StatusCode.BadRequest, messageText, data)

    const result = createErrorResponse(message, statusCode, error)

    const payload = { status: statusCode, message: 'Internal Server Error', traceId: message.traceId }

    expect(result.messageType).toBe(EBMessageType.CommandErrorResponse)
    expect(result.payload).toStrictEqual(payload)
    expect(result.sender).toStrictEqual(message.receiver)
    expect(result.receiver).toStrictEqual(message.sender)
    expect(result.traceId).toBe(message.traceId)
    expect(result.correlationId).toBe(message.correlationId)
    expect(result.id).toBe(message.id)
    expect(result.isHandledError).toBeFalsy()
  })
})
