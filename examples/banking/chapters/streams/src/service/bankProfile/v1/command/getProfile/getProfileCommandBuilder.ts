import { bankProfileV1ServiceBuilder } from '../../bankProfileV1ServiceBuilder.js'
import {
	bankProfileV1GetProfileInputParameterSchema,
	bankProfileV1GetProfileInputPayloadSchema,
	bankProfileV1GetProfileOutputPayloadSchema,
} from './schema.js'

export const getProfileCommandBuilder = bankProfileV1ServiceBuilder
	.getCommandBuilder('getProfile', 'Describe the fictional bank')
	.addPayloadSchema(bankProfileV1GetProfileInputPayloadSchema)
	.addParameterSchema(bankProfileV1GetProfileInputParameterSchema)
	.addOutputSchema(bankProfileV1GetProfileOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'profile')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return { name: 'Example Bank', currency: 'EUR' }
	})
