import { CustomMessage, EBMessageType, getNewCorrelationId, getNewEBMessageId, getNewTraceId } from '../../core'

/**
 * A helper to create a custom message.
 * All message fields are prefilled with dummy defaults.
 * They can be overwritten by optional parameter.
 *
 * ```typescript
 * createTestCustomMsg('theEvenName', 'the custom event payload' ,{
 *   principalId: 'abc-1234'
 * })
 * ```
 *
 * @param input partial CustomMessage
 * @returns CustomMessage
 */
export const createTestCustomMsg = <Payload = unknown>(
  eventName: string,
  payload?: Payload,
  input?: Partial<CustomMessage<Payload>>,
): CustomMessage<Payload> => {
  const defaultMsg: CustomMessage<Payload> = {
    eventName,
    id: getNewEBMessageId(),
    instanceId: 'SenderInstanceId',
    timestamp: Date.now(),
    traceId: getNewTraceId(),
    messageType: EBMessageType.CustomMessage,
    correlationId: getNewCorrelationId(),
    sender: {
      serviceName: 'CommandSenderService',
      serviceTarget: 'commandSenderFunction',
      serviceVersion: '1',
    },
    payload,
  }

  return {
    ...defaultMsg,
    ...input,
  } as CustomMessage<Payload>
}
