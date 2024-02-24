import type { Command, CommandSuccessResponse } from '../../core/index.js'
import { createSuccessResponse, getNewInstanceId } from '../../core/index.js'
import { getCommandMessageMock } from './getCommandMessage.mock.js'

/**
 * A function that returns a mocked command success response message.
 *
 * @group Unit test helper
 * */
export const getCommandSuccessMessageMock = <PayloadType>(
  payload: PayloadType,
  input?: Partial<CommandSuccessResponse<PayloadType>>,
  commandMessage?: Command,
): Readonly<CommandSuccessResponse<PayloadType>> => {
  const cmdMessage: Readonly<Command<unknown, unknown>> = commandMessage ?? getCommandMessageMock()

  const successResponse: Readonly<CommandSuccessResponse<PayloadType>> = Object.freeze({
    ...createSuccessResponse(commandMessage?.receiver.instanceId ?? getNewInstanceId(), cmdMessage, payload),
    ...input,
  })

  return successResponse
}
