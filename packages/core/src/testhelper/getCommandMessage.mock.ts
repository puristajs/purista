import {
  Command,
  EBMessageType,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewInstanceId,
  getNewTraceId,
} from '../core'

/* A function that returns a command message mock object. */
export const getCommandMessageMock = (input?: Partial<Command>): Readonly<Command<unknown, unknown>> => {
  const commandMessage: Readonly<Command<unknown, unknown>> = Object.freeze({
    id: getNewEBMessageId(),
    timestamp: Date.now(),
    messageType: EBMessageType.Command,
    correlationId: getNewCorrelationId(),
    traceId: getNewTraceId(),
    instanceId: getNewInstanceId(),
    principalId: 'mocked-principal-id',
    sender: {
      serviceName: 'mocked_sender',
      serviceVersion: '1',
      serviceTarget: 'mockedSenderFunction',
    },
    receiver: {
      serviceName: 'mocked_receiver',
      serviceVersion: '1',
      serviceTarget: 'mockedReceiverFunction',
    },
    payload: {
      payload: {},
      parameter: {},
    },
    ...input,
  })
  return commandMessage
}
