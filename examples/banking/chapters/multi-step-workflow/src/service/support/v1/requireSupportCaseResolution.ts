import { HandledError, StatusCode } from '@purista/core'
import type { SupportCasePolicy } from './SupportResources.js'

export async function requireSupportCaseResolution(
	policy: SupportCasePolicy,
	input: Readonly<{ tenantId?: string; principalId?: string; caseId: string }>,
) {
	if (!input.tenantId || !input.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canResolve({
			tenantId: input.tenantId,
			principalId: input.principalId,
			caseId: input.caseId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'Support case resolution is not allowed')
	}
}
