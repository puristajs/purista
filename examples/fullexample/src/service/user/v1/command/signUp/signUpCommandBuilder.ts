import { randomUUID } from 'node:crypto'

import { HandledError, StatusCode } from '@purista/core'

import type { User } from '../../../../../types/index.js'
import { StateStoreKey } from '../../../../../types/index.js'
import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { userV1ServiceBuilder } from '../../userV1ServiceBuilder.js'
import {
	userV1SignUpInputParameterSchema,
	userV1SignUpInputPayloadSchema,
	userV1SignUpOutputPayloadSchema,
} from './schema.js'

export const signUpCommandBuilder = userV1ServiceBuilder
	.getCommandBuilder('signUp', 'registers a new user at our product')
	.setSuccessEventName(ServiceEvent.NewUserRegistered)
	.addPayloadSchema(userV1SignUpInputPayloadSchema)
	.addParameterSchema(userV1SignUpInputParameterSchema)
	.addOutputSchema(userV1SignUpOutputPayloadSchema)
	.exposeAsHttpEndpoint('POST', 'user/signup')
	.setCommandFunction(async function (context, payload, _parameter) {
		const result = (await context.states.getState(StateStoreKey.Users)) as { [StateStoreKey.Users]: User[] | undefined }

		if (result.users?.some(user => user.email === payload.email)) {
			throw new HandledError(StatusCode.BadRequest, 'the user already exists')
		}

		const user: User = {
			...payload,
			userId: randomUUID(),
		}

		const users = result.users ?? []
		users.push(user)

		await context.states.setState(StateStoreKey.Users, users)

		// add your business logic here
		context.logger.info('new user added')

		return user
	})
