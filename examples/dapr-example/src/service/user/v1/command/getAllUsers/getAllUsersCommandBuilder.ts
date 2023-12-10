import type { User } from '../../../../../types/index.js'
import { StateStoreKey } from '../../../../../types/index.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
  userV1GetAllUsersInputParameterSchema,
  userV1GetAllUsersInputPayloadSchema,
  userV1GetAllUsersOutputPayloadSchema,
} from './schema.js'

export const getAllUsersCommandBuilder = userV1ServiceBuilder
  .getCommandBuilder('getAllUsers', 'returns a list of registered users')
  .addPayloadSchema(userV1GetAllUsersInputPayloadSchema)
  .addParameterSchema(userV1GetAllUsersInputParameterSchema)
  .addOutputSchema(userV1GetAllUsersOutputPayloadSchema)
  .exposeAsHttpEndpoint('GET', '/user')
  .setCommandFunction(async function (context, _payload, _parameter) {
    const result: { users?: User[] } = await context.states.getState(StateStoreKey.Users)
    const users = result.users || []

    return users
  })
