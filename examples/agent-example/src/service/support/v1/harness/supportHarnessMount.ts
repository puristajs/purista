import { commandAsHarnessTool } from '@purista/core'

import { supportHarness } from '../../../../harness/support/supportHarness.js'

export { supportHarness }

export const supportHarnessPolicy = {
	publish: {
		agents: ['triage_ticket', 'analyze_signals'],
		workflows: ['review_rollback'],
	},
	hostTools: {
		get_incident_snapshot: commandAsHarnessTool('Support', '1', 'getIncidentSnapshot'),
		get_runbook: commandAsHarnessTool('Support', '1', 'getRunbook'),
	},
} as const
