import { StatusCode, UnhandledError } from '../core'
import { throwIfNotValidMessage } from './throwIfNotValidMessage.impl'

describe('throwIfNotValidMessage', () => {
  test("valid input doesn't throw", () => {
    expect(() => {
      throwIfNotValidMessage({
        sender: {
          serviceName: 'SenderService',
          serviceVersion: '1',
          serviceTarget: 'senderServiceTarget',
          instanceId: 'SenderServiceInstance',
        },
        messageType: 'command',
        id: 'my-id',
        timestamp: 123456,
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        traceId: 'my-trace-id',
        correlationId: 'my-correlation-id',
        principalId: 'my-principal-id',
        eventName: 'my-event-name',
        otp: 'my-otp',
      })
    }).not.toThrow()
  })

  test('invalid input throws an error', () => {
    expect(() => {
      throwIfNotValidMessage({ invalid: 'input' })
    }).toThrowError(
      new UnhandledError(
        StatusCode.BadRequest,
        'Input is no valid PURISTA event bridge message - see https://purista.dev',
      ),
    )
  })
})
