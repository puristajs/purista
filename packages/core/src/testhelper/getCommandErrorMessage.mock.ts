import {
  Command,
  CommandErrorResponse,
  createErrorResponse,
  getNewInstanceId,
  HandledError,
  StatusCode,
  UnhandledError,
} from '../core'
import { getCommandMessageMock } from './getCommandMessage.mock'

/* A function that returns a command error response message mock object. */
export const getCommandErrorMessageMock = (
  error?: HandledError | UnhandledError,
  statusCode?: StatusCode,
  input?: Partial<CommandErrorResponse>,
): Readonly<CommandErrorResponse> => {
  const commandMessage: Readonly<Command<unknown, unknown>> = getCommandMessageMock()

  const successResponse: Readonly<CommandErrorResponse> = Object.freeze({
    ...createErrorResponse(commandMessage, statusCode, error),
    instanceId: getNewInstanceId(),
    ...input,
  })
  return successResponse
}
