import { supportV1IncidentRunbookSchema, supportV1RunbookPayloadSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const getRunbookCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('getRunbook', 'Returns the operational runbook for a service')
	.addPayloadSchema(supportV1RunbookPayloadSchema)
	.addOutputSchema(supportV1IncidentRunbookSchema)
	.setCommandFunction(async function (context, payload) {
		return context.resources.incidentRepository.getRunbook(payload.service)
	})
