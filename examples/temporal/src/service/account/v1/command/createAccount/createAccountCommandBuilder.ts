import { ServiceEvent } from '../../../../ServiceEvent.enum.js'
import { accountV1ServiceBuilder } from '../../accountV1ServiceBuilder.js'
import {
	accountV1CreateAccountInputParameterSchema,
	accountV1CreateAccountInputPayloadSchema,
	accountV1CreateAccountOutputPayloadSchema,
} from './schema.js'

export const createAccountCommandBuilder = accountV1ServiceBuilder
	.getCommandBuilder('createAccount', 'creates a new bank account for given user')
	.setSuccessEventName(ServiceEvent.BankAccountCreated)
	.addPayloadSchema(accountV1CreateAccountInputPayloadSchema)
	.addParameterSchema(accountV1CreateAccountInputParameterSchema)
	.addOutputSchema(accountV1CreateAccountOutputPayloadSchema)
	.setCommandFunction(async function (_context, _payload, _parameter) {
		// add your business logic here
	})
