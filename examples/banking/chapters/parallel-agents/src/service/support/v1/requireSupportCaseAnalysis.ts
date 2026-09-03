import { HandledError, StatusCode } from '@purista/core'
import type { SupportCasePolicy } from './SupportResources.js'

export async function requireSupportCaseAnalysis(
	policy: SupportCasePolicy,
	input: Readonly<{ tenantId?: string; principalId?: string; caseId: string }>,
) {
	if (!input.tenantId || !input.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canAnalyze({
			tenantId: input.tenantId,
			principalId: input.principalId,
			caseId: input.caseId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'Support case analysis is not allowed')
	}
}

export function supportCaseSessionId(identity: Readonly<{ tenantId?: string; principalId?: string }>, caseId: string) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	return `support-case:${identity.tenantId}:${identity.principalId}:${caseId}`
}
