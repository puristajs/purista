import { defineHarnessModule } from '@purista/harness'

import {
	supportV1IncidentIdPayloadSchema,
	supportV1IncidentRunbookSchema,
	supportV1IncidentSnapshotSchema,
	supportV1RunbookPayloadSchema,
} from '../../../service/support/v1/schema.js'

/** Provider-neutral contracts implemented by the owning PURISTA service. */
export const incidentHostTools = defineHarnessModule()('support.tools.incident', {
	version: '1.0.0',
	register(builder) {
		return builder
			.hostTool('get_incident_snapshot', {
				kind: 'host',
				description: 'Load the trusted alert, log, deployment, and metric snapshot for an incident.',
				input: supportV1IncidentIdPayloadSchema,
				output: supportV1IncidentSnapshotSchema,
			})
			.hostTool('get_runbook', {
				kind: 'host',
				description: 'Load the trusted operational runbook for a service.',
				input: supportV1RunbookPayloadSchema,
				output: supportV1IncidentRunbookSchema,
			})
	},
})
