import { supportV1IncidentRunbookSchema, supportV1RunbookPayloadSchema } from '../../../schema.js'
import { supportV1ServiceBuilder } from '../../../supportV1ServiceBuilder.js'

/** Loads the operational runbook through the owning service resource. */
export const getRunbookTool = supportV1ServiceBuilder
	.defineTool('getRunbook', {
		description: 'Load the trusted operational runbook for a service.',
		input: supportV1RunbookPayloadSchema,
		output: supportV1IncidentRunbookSchema,
	})
	.setHandler(async (context, input) => context.resources.incidentRepository.getRunbook(input.service))
