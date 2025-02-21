import type { HandledError } from '../../core/Error/HandledError.impl.js'
import type { UnhandledError } from '../../core/Error/UnhandledError.impl.js'
import { createErrorResponse } from '../../core/helper/createErrorResponse.impl.js'
import { getNewInstanceId } from '../../core/helper/getNewInstanceId.impl.js'
import type { Command } from '../../core/types/commandType/Command.js'
import type { CommandErrorResponse } from '../../core/types/commandType/CommandErrorResponse.js'
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
