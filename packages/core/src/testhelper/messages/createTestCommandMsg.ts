import { Command, EBMessageType, getNewCorrelationId, getNewEBMessageId, getNewTraceId } from '../../core'

export const createTestCommandMsg = <Payload = unknown, Parameter = unknown>(
  input?: Partial<Command<Payload, Parameter>>,
): Command<Payload, Parameter> => {
  const command = {
    id: getNewEBMessageId(),
    instanceId: 'SenderInstanceId',
    timestamp: Date.now(),
    traceId: getNewTraceId(),
    messageType: EBMessageType.Command,
    correlationId: getNewCorrelationId(),
    sender: {
      serviceName: 'CommandSenderService',
      serviceTarget: 'commandSenderFunction',
      serviceVersion: '1',
    },
    receiver: {
      serviceName: 'CommandReceiverService',
      serviceTarget: 'commandReceiverFunction',
      serviceVersion: '1',
    },
    payload: {
      payload: undefined,
      parameter: undefined,
    },
  }

  return {
    ...command,
    ...input,
  } as Command<Payload, Parameter>
}
