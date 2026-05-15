import type { RunEvent } from '@purista/harness'

import type { AgentRunEvent, AgentRunIdentity } from '../types.js'

export function createAgentRunEvent(identity: AgentRunIdentity, event: RunEvent): AgentRunEvent {
	return {
		identity: {
			...identity,
			runId: event.runId,
		},
		event,
	}
}
