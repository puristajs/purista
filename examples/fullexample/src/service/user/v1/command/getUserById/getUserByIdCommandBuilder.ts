import { HandledError, StatusCode } from '@purista/core'

import type { User } from '../../../../../types/index.js'
import { StateStoreKey } from '../../../../../types/index.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
  userV1GetUserByIdInputParameterSchema,
  userV1GetUserByIdInputPayloadSchema,
  userV1GetUserByIdOutputPayloadSchema,
} from './schema.js'

export const getUserByIdCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('getUserById', 'returns the user given by the user id')
  .addPayloadSchema(userV1GetUserByIdInputPayloadSchema)
  .addParameterSchema(userV1GetUserByIdInputParameterSchema)
  .addOutputSchema(userV1GetUserByIdOutputPayloadSchema)
  .exposeAsHttpEndpoint('GET', 'user/:userId')
  .setCommandFunction(async function (context, _payload, parameter) {
    const result: { users?: User[] } = await context.states.getState(StateStoreKey.Users)
    const users = result.users || []

    const user = users.find((user) => (user.userId = parameter.userId))

    if (!user) {
      throw new HandledError(StatusCode.NotFound, 'user could not be found', { userId: parameter.userId })
    }

    return user
  })
