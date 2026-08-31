import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1GetBankInfoInputParameterSchema,
	bankingV1GetBankInfoInputPayloadSchema,
	bankingV1GetBankInfoOutputPayloadSchema,
} from './schema.js'

export const getBankInfoCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('getBankInfo', 'Describe the fictional bank')
	.addPayloadSchema(bankingV1GetBankInfoInputPayloadSchema)
	.addParameterSchema(bankingV1GetBankInfoInputParameterSchema)
	.addOutputSchema(bankingV1GetBankInfoOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'bank')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return { name: 'Example Bank', currency: 'EUR' as const }
	})
