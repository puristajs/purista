import { randomUUID } from 'node:crypto'

import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
	userV1CreateUserInputParameterSchema,
	userV1CreateUserInputPayloadSchema,
	userV1CreateUserOutputPayloadSchema,
} from './schema.js'

export const createUserCommandBuilder = userV1ServiceBuilder
	.getCommandBuilder('createUser', 'creates a new user')
	.setSuccessEventName(ServiceEvent.UserCreated)
	.addPayloadSchema(userV1CreateUserInputPayloadSchema)
	.addParameterSchema(userV1CreateUserInputParameterSchema)
	.addOutputSchema(userV1CreateUserOutputPayloadSchema)
	.setCommandFunction(async function ({ logger }, payload, _parameter) {
		logger.info({ payload }, 'create new user called')

		return {
			userId: randomUUID(),
		}
	})
