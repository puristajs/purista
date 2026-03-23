import { HandledError, StatusCode } from '@purista/core'
import type { SandboxMetadata, SandboxOwner, SandboxScope } from '../../../../types/SandboxDriver.js'

type MessageIdentityContext = {
	message?: {
		tenantId?: string
		principalId?: string
	}
}

type ProvisioningPayload = {
	projectId: string
	organizationId?: string
	userId?: string
	scope?: SandboxScope
}

const getCallerIdentity = (context: MessageIdentityContext) => {
	const organizationId = context.message?.tenantId?.trim()
	const userId = context.message?.principalId?.trim()

	if (!organizationId || !userId) {
		throw new HandledError(
			StatusCode.Unauthorized,
			'Sandbox commands require message tenantId and principalId for ownership enforcement.',
		)
	}

	return { organizationId, userId }
}

export const resolveSandboxOwnerFromMessage = (
	context: MessageIdentityContext,
	payload: ProvisioningPayload,
): SandboxOwner => {
	const caller = getCallerIdentity(context)

	if (payload.organizationId && payload.organizationId !== caller.organizationId) {
		throw new HandledError(StatusCode.Forbidden, 'Sandbox organizationId must match the caller tenantId.', {
			tenantId: caller.organizationId,
			organizationId: payload.organizationId,
		})
	}

	if (payload.userId && payload.userId !== caller.userId) {
		throw new HandledError(StatusCode.Forbidden, 'Sandbox userId must match the caller principalId.', {
			principalId: caller.userId,
			userId: payload.userId,
		})
	}

	return {
		organizationId: caller.organizationId,
		projectId: payload.projectId,
		userId: caller.userId,
		scope: payload.scope,
	}
}

export const assertSandboxAccess = (context: MessageIdentityContext, metadata: SandboxMetadata): void => {
	const caller = getCallerIdentity(context)

	if (caller.organizationId !== metadata.organizationId || caller.userId !== metadata.userId) {
		throw new HandledError(StatusCode.Forbidden, 'Caller is not allowed to access this sandbox.', {
			sandboxId: metadata.sandboxId,
			organizationId: metadata.organizationId,
			userId: metadata.userId,
		})
	}
}
