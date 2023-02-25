import { Command, CommandSuccessResponse, createSuccessResponse, getNewInstanceId } from '../core'
import { getCommandMessageMock } from './getCommandMessage.mock'

/* A function that returns a command success response message mock object. */
export const getCommandSuccessMessageMock = <PayloadType>(
  payload: PayloadType,
  input?: Partial<CommandSuccessResponse<PayloadType>>,
): Readonly<CommandSuccessResponse<PayloadType>> => {
  const commandMessage: Readonly<Command<unknown, unknown>> = getCommandMessageMock()

  const successResponse: Readonly<CommandSuccessResponse<PayloadType>> = Object.freeze({
    ...createSuccessResponse(commandMessage, payload),
    instanceId: getNewInstanceId(),
    ...input,
  })

  return successResponse
}
