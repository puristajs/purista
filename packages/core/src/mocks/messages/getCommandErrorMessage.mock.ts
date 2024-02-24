import {
  type Command,
  type CommandErrorResponse,
  createErrorResponse,
  getNewInstanceId,
  type HandledError,
  type UnhandledError,
} from '../../core/index.js'
import { getCommandMessageMock } from './getCommandMessage.mock.js'

/**
 * A function that returns a mocked command error response message
 *
 * @group Unit test helper
 */
export const getCommandErrorMessageMock = (
  error?: HandledError | UnhandledError,
  input?: Partial<CommandErrorResponse>,
  commandMessage?: Command,
): Readonly<CommandErrorResponse> => {
  const cmdMessage: Readonly<Command<unknown, unknown>> = commandMessage ?? getCommandMessageMock()

  const successResponse: Readonly<CommandErrorResponse> = Object.freeze({
    ...createErrorResponse(getNewInstanceId(), cmdMessage, error?.errorCode, error),
    ...input,
  })
  return successResponse
}
