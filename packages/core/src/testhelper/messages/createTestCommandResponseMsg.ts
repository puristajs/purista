import { CommandResponse, EBMessageType, getNewCorrelationId, getNewEBMessageId, getNewTraceId } from '../../core'

/**
 * A helper to create a command response message.
 * All message fields are prefilled with dummy defaults.
 * They can be overwritten by optional parameter.
 *
 * ```typescript
 * createTestCommandResponseMsg({
 *   payload: 'the response payload'
 * })
 * ```
 *
 * @param input partial CommandResponse
 * @returns CommandResponse
 */
export const createTestCommandResponseMsg = <Payload = unknown>(
  input?: Partial<CommandResponse<Payload>>,
): CommandResponse<Payload> => {
  const defaultMsg = {
    id: getNewEBMessageId(),
    instanceId: 'SenderInstanceId',
    timestamp: Date.now(),
    traceId: getNewTraceId(),
    messageType: EBMessageType.CommandSuccessResponse,
    correlationId: getNewCorrelationId(),
    receiver: {
      serviceName: 'CommandSenderService',
      serviceTarget: 'commandSenderFunction',
      serviceVersion: '1',
    },
    sender: {
      serviceName: 'CommandReceiverService',
      serviceTarget: 'commandReceiverFunction',
      serviceVersion: '1',
    },
    payload: undefined,
  }

  return {
    ...defaultMsg,
    ...input,
  } as CommandResponse<Payload>
}
