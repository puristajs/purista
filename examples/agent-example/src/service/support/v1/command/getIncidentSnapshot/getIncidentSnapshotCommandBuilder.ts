import { supportV1IncidentIdPayloadSchema, supportV1IncidentSnapshotSchema } from '../../schema.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

export const getIncidentSnapshotCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('getIncidentSnapshot', 'Returns alert, log, deployment, and metric evidence for an incident')
	.addPayloadSchema(supportV1IncidentIdPayloadSchema)
	.addOutputSchema(supportV1IncidentSnapshotSchema)
	.setCommandFunction(async function (context, payload) {
		return context.resources.incidentRepository.getSnapshot(payload.incidentId)
	})
