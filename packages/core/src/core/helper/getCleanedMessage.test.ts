import { Command, CommandSuccessResponse, EBMessageType } from '../types'
import { getCleanedMessage } from './getCleanedMessage.impl'

describe('prevent sensitive data to be logged in production', () => {
  it('returns the original message', () => {
    const message: Command = {
      sender: {
        serviceName: 'SenderService',
        serviceVersion: '1.1.1',
        serviceTarget: 'senderServiceTarget',
        instanceId: 'SenderServiceInstance',
      },

      receiver: {
        serviceName: 'ReceiverService',
        serviceVersion: '2.2.2',
        serviceTarget: 'receiverServiceTarget',
        instanceId: 'ReceiverServiceInstance',
      },
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageType: EBMessageType.Command,
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      payload: {
        payload: { content: 'content' },
        parameter: { param: 1 },
      },
    }

    const result = getCleanedMessage(message, false) as Command

    expect(result).toBe(message)
  })

  it('removes payload and parameter from command message', () => {
    const message: Command = {
      sender: {
        serviceName: 'SenderService',
        serviceVersion: '1.1.1',
        serviceTarget: 'senderServiceTarget',
        instanceId: 'SenderServiceInstance',
      },

      receiver: {
        serviceName: 'ReceiverService',
        serviceVersion: '2.2.2',
        serviceTarget: 'receiverServiceTarget',
        instanceId: 'ReceiverServiceInstance',
      },
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageType: EBMessageType.Command,
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      payload: {
        payload: { content: 'content' },
        parameter: { param: 1 },
      },
    }

    const result = getCleanedMessage(message, true) as Command<string, { all: string }>

    expect(result).not.toStrictEqual(message)
    expect(result.payload.payload).toBe('***removed from log***')
    expect(result.payload.parameter.all).toBe('***removed from log***')
  })

  it('removes response from command success message', () => {
    const message: CommandSuccessResponse = {
      sender: {
        serviceName: 'SenderService',
        serviceVersion: '1.1.1',
        serviceTarget: 'senderServiceTarget',
        instanceId: 'SenderServiceInstance',
      },

      receiver: {
        serviceName: 'ReceiverService',
        serviceVersion: '2.2.2',
        serviceTarget: 'receiverServiceTarget',
        instanceId: 'ReceiverServiceInstance',
      },
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageType: EBMessageType.CommandSuccessResponse,
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      payload: { content: 'content' },
    }

    const result = getCleanedMessage(message, true) as CommandSuccessResponse

    expect(result).not.toStrictEqual(message)
    expect(result.payload).toBe('***removed from log***')
  })
})
