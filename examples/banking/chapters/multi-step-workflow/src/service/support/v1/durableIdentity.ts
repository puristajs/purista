import { createHash } from 'node:crypto'

export function durableResolutionIdentity(tenantId: string, principalId: string, caseId: string) {
	const digest = createHash('sha256').update(`${tenantId}:${principalId}:${caseId}:support-resolution-v1`).digest('hex')
	return {
		sessionId: `support-resolution:${digest}`,
		runId: `support-resolution-run:${digest}`,
	}
}
