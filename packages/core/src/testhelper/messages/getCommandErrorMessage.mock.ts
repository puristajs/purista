import {
  Command,
  CommandErrorResponse,
  createErrorResponse,
  getNewInstanceId,
  HandledError,
  UnhandledError,
} from '../../core'
import { getCommandMessageMock } from './getCommandMessage.mock'

/**
 * A function that returns a mocked command error response message
 */
export const getCommandErrorMessageMock = (
  error?: HandledError | UnhandledError,
  input?: Partial<CommandErrorResponse>,
  commandMessage?: Command,
): Readonly<CommandErrorResponse> => {
  const cmdMessage: Readonly<Command<unknown, unknown>> = commandMessage || getCommandMessageMock()

  const successResponse: Readonly<CommandErrorResponse> = Object.freeze({
    ...createErrorResponse(cmdMessage, error?.errorCode, error),
    instanceId: getNewInstanceId(),
    ...input,
  })
  return successResponse
}
