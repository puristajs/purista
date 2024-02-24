import type { Command } from '../../core/index.js'
import {
  EBMessageType,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewInstanceId,
  getNewTraceId,
} from '../../core/index.js'

/**
 * A function that returns a mocked command message.
 *
 * @group Unit test helper
 * */
export const getCommandMessageMock = <Payload = unknown, Parameter = unknown>(
  input?: Partial<Command<Payload, Parameter>> & {
    payload?: {
      payload?: Payload
      parameter?: Parameter
    }
  },
): Readonly<Command<Payload, Parameter>> => {
  const commandMessage: Readonly<Command<Payload, Parameter>> = Object.freeze({
    id: getNewEBMessageId(),
    timestamp: Date.now(),
    messageType: EBMessageType.Command,
    correlationId: getNewCorrelationId(),
    traceId: getNewTraceId(),
    principalId: 'mocked-principal-id',
    tenantId: 'mocked-tenant-id',
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    sender: {
      serviceName: 'mocked_sender',
      serviceVersion: '1',
      serviceTarget: 'mockedSenderFunction',
      instanceId: getNewInstanceId(),
    },
    receiver: {
      serviceName: 'mocked_receiver',
      serviceVersion: '1',
      serviceTarget: 'mockedReceiverFunction',
      instanceId: getNewInstanceId(),
    },
    payload: {
      payload: input?.payload?.payload as Payload,
      parameter: (input?.payload?.parameter ?? {}) as Parameter,
    },
    ...input,
  })
  return commandMessage
}
