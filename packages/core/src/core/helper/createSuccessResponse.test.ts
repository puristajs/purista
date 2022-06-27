import { Command, EBMessageType } from '../types'
import { createSuccessResponse } from './createSuccessResponse.impl'

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
      command: {
        payload: { input: 'input payload' },
        parameter: { input: 'parameter' },
      },
    }

    const result = createSuccessResponse(message, payload)

    expect(result.messageType).toBe(EBMessageType.CommandSuccessResponse)
    expect(result.response).toBe(payload)
    expect(result.sender).toStrictEqual(message.receiver)
    expect(result.receiver).toStrictEqual(message.sender)
    expect(result.traceId).toBe(message.traceId)
    expect(result.correlationId).toBe(message.correlationId)
    expect(result.id).toBe(message.id)
  })

  it('it adds a trace id', () => {
    const payload = { content: 'result content' }

    const message: Command = {
      messageType: EBMessageType.Command,
      id: 'messageTestId',
      timestamp: Date.now(),
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
      command: {
        payload: { input: 'input payload' },
        parameter: { input: 'parameter' },
      },
    }

    const result = createSuccessResponse(message, payload)

    expect(result.messageType).toBe(EBMessageType.CommandSuccessResponse)
    expect(result.response).toBe(payload)
    expect(result.sender).toStrictEqual(message.receiver)
    expect(result.receiver).toStrictEqual(message.sender)
    expect(result.traceId).toBeDefined()
  })
})
