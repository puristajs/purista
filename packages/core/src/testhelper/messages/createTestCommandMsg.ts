import { Command, EBMessageType, getNewCorrelationId, getNewEBMessageId, getNewTraceId } from '../../core'

/**
 * A helper to create a command message.
 * All message fields are prefilled with dummy defaults.
 * They can be overwritten by optional parameter.
 *
 * ```typescript
 * createTestCommandMsg({
 *   payload: {
 *      payload: 'some input payload',
 *      parameter: 'some parameter input'
 *    }
 * })
 * ```
 *
 * @param input partial Command
 * @returns Command
 */
export const createTestCommandMsg = <Payload = unknown, Parameter = unknown>(
  input?: Partial<Command<Payload, Parameter>>,
): Command<Payload, Parameter> => {
  const defaultMsg = {
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
    ...defaultMsg,
    ...input,
  } as Command<Payload, Parameter>
}
