import { createHash } from 'node:crypto'

export function durableResolutionIdentity(tenantId: string, principalId: string, caseId: string) {
	const digest = createHash('sha256')
		.update(JSON.stringify(['support-resolution-v1', tenantId, principalId, caseId]))
		.digest('hex')
	return {
		sessionId: `support-resolution:${digest}`,
		runId: `support-resolution-run:${digest}`,
	}
}
