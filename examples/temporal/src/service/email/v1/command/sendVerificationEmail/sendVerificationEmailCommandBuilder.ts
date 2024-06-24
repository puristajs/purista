import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder.js'
import {
	emailV1SendVerificationEmailInputParameterSchema,
	emailV1SendVerificationEmailInputPayloadSchema,
	emailV1SendVerificationEmailOutputPayloadSchema,
} from './schema.js'

export const sendVerificationEmailCommandBuilder = emailV1ServiceBuilder
	.getCommandBuilder('sendVerificationEmail', 'sends a verification email')
	.addPayloadSchema(emailV1SendVerificationEmailInputPayloadSchema)
	.addParameterSchema(emailV1SendVerificationEmailInputParameterSchema)
	.addOutputSchema(emailV1SendVerificationEmailOutputPayloadSchema)
	.setCommandFunction(async function ({ logger, states }, payload, _parameter) {
		// add your business logic here
		logger.info({ payload }, 'sendVerificationEmail called')
		await states.setState(payload.email, payload)
	})
