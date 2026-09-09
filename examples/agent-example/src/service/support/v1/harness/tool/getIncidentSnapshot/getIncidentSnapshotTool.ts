import { supportV1IncidentIdPayloadSchema, supportV1IncidentSnapshotSchema } from '../../../schema.js'
import { supportV1ServiceBuilder } from '../../../supportV1ServiceBuilder.js'

/** Loads trusted incident evidence through the owning service resource. */
export const getIncidentSnapshotTool = supportV1ServiceBuilder
	.defineTool('getIncidentSnapshot', {
		description: 'Load the trusted alert, log, deployment, and metric snapshot for an incident.',
		input: supportV1IncidentIdPayloadSchema,
		output: supportV1IncidentSnapshotSchema,
	})
	.setHandler(async (context, input) => context.resources.incidentRepository.getSnapshot(input.incidentId))
