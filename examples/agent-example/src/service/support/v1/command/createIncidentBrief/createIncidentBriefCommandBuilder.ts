import {
	supportV1CreateIncidentBriefInputPayloadSchema,
	supportV1CreateIncidentBriefOutputPayloadSchema,
} from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const createIncidentBriefCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('createIncidentBrief', 'Stores the final incident commander brief as deterministic state')
	.addPayloadSchema(supportV1CreateIncidentBriefInputPayloadSchema)
	.addOutputSchema(supportV1CreateIncidentBriefOutputPayloadSchema)
	.setCommandFunction(async function (context, payload) {
		return context.resources.incidentRepository.createBrief(payload)
	})
