import {
  CommandErrorResponse,
  EBMessageType,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
  HandledError,
  UnhandledError,
} from '../../core'

/**
 * A helper to create a command error response message.
 * You need to provide a HandledError or Unhandled error as input.
 * All message fields are prefilled with dummy defaults.
 * They can be overwritten by optional parameter.
 *
 * ```typescript
 * createTestCommandErrorResponseMsg(
 *    new HandledError(400,'invalid input)
 * {
 *   principalId: 'abc-123-4567'
 * })
 * ```
 *
 * @param input partial Command
 * @returns Command
 */
export const createTestCommandErrorResponseMsg = (
  error: HandledError | UnhandledError,
  input?: Partial<CommandErrorResponse>,
): CommandErrorResponse => {
  const defaultMsg: CommandErrorResponse = {
    id: getNewEBMessageId(),
    instanceId: 'SenderInstanceId',
    timestamp: Date.now(),
    traceId: getNewTraceId(),
    messageType: EBMessageType.CommandErrorResponse,
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
    payload: error.getErrorResponse(),
    isHandledError: error instanceof HandledError,
  }

  return {
    ...defaultMsg,

    ...input,
  } as CommandErrorResponse
}
