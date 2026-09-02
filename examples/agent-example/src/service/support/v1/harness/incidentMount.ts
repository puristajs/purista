import { commandAsHarnessTool } from '@purista/core'

import { incidentHarness } from '../../../../harness/incident/incidentHarness.js'

export { incidentHarness }

export const incidentHarnessPolicy = {
	publish: {
		agents: ['triage_ticket', 'analyze_signals'],
		workflows: ['review_rollback'],
	},
	hostTools: {
		get_incident_snapshot: commandAsHarnessTool('Support', '1', 'getIncidentSnapshot'),
		get_runbook: commandAsHarnessTool('Support', '1', 'getRunbook'),
	},
} as const
