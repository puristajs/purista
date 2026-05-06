import { HandledError, StatusCode } from '@purista/core'
import type {
	AgentSandboxRuntimeConfig,
	SandboxAdapter,
	SandboxDescriptor,
	SandboxSubject,
	SandboxSubjectResolverInput,
} from '../sandbox/provider.js'
import type { SandboxScope } from '../sandbox/types/SandboxDriver.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import type { AgentInvocationIdentity } from './invocationIdentity.js'

export type AgentSandboxEnsureOptions = {
	scope?: SandboxScope
	gitConfig?: {
		username: string
		email: string
		token?: string
	}
}

export type AgentSandboxHelpers = {
	ensure(options?: AgentSandboxEnsureOptions): Promise<SandboxDescriptor>
	adapter(options?: AgentSandboxEnsureOptions): Promise<SandboxAdapter>
}

type MinimalProtocolMessage = {
	id: string
	sender: {
		instanceId?: string
	}
	receiver: {
		instanceId?: string
	}
	tenantId?: string
	principalId?: string
}

type CreateAgentSandboxHelpersInput<Resources extends Record<string, unknown>> = {
	config?: AgentSandboxRuntimeConfig<Resources>
	manifest: AgentManifest
	payload: unknown
	parameter: unknown
	message: MinimalProtocolMessage
	resources: Resources
	identity?: AgentInvocationIdentity
}

const getPolicyScope = (input: CreateAgentSandboxHelpersInput<Record<string, unknown>>, override?: SandboxScope) => {
	if (override) {
		return override
	}

	const policy = input.manifest.sandbox
	if (!policy || policy.mode === 'disabled') {
		throw new HandledError(
			StatusCode.BadRequest,
			'This agent does not declare sandbox access. Configure .setSandboxPolicy(...) or pass an explicit runtime override.',
		)
	}

	switch (policy.scope) {
		case 'shared-project-user':
			return { kind: 'shared-project-user' } as const
		case 'conversation':
			if (!input.identity?.conversationId) {
				throw new HandledError(StatusCode.BadRequest, 'Sandbox conversation scope requires a resolved conversationId.')
			}
			return { kind: 'conversation', key: input.identity.conversationId } as const
		case 'agent-run':
			return { kind: 'agent-run', key: input.message.id } as const
		case 'agent-instance': {
			const instanceId =
				input.message.receiver.instanceId ?? input.message.sender.instanceId ?? input.manifest.agentName
			return { kind: 'agent-instance', key: `${input.manifest.agentName}:${instanceId}` } as const
		}
		case 'runtime-instance': {
			const instanceId =
				input.message.receiver.instanceId ?? input.message.sender.instanceId ?? input.manifest.agentName
			return { kind: 'runtime-instance', key: instanceId } as const
		}
		default:
			return { kind: 'shared-project-user' } as const
	}
}

const getScopeCacheKey = (scope?: SandboxScope) =>
	!scope || scope.kind === 'shared-project-user' ? 'shared-project-user' : `${scope.kind}:${scope.key}`

const resolveSubject = async <Resources extends Record<string, unknown>>(
	input: CreateAgentSandboxHelpersInput<Resources>,
): Promise<SandboxSubject> => {
	if (!input.config) {
		throw new HandledError(
			StatusCode.InternalServerError,
			'No sandbox runtime was configured. Provide ai.sandbox.provider and ai.sandbox.resolveSubject at getInstance(...).',
		)
	}

	const resolved = await input.config.resolveSubject({
		payload: input.payload,
		parameter: input.parameter,
		message: {
			tenantId: input.message.tenantId,
			principalId: input.message.principalId,
		},
		identity: input.identity,
		manifest: input.manifest,
		resources: input.resources,
	} as SandboxSubjectResolverInput<Resources>)

	return resolved
}

export const createAgentSandboxHelpers = <Resources extends Record<string, unknown>>(
	input: CreateAgentSandboxHelpersInput<Resources>,
): AgentSandboxHelpers => {
	const descriptorCache = new Map<string, Promise<SandboxDescriptor>>()
	const adapterCache = new Map<string, SandboxAdapter>()

	return {
		async ensure(options) {
			const scope = getPolicyScope(input as CreateAgentSandboxHelpersInput<Record<string, unknown>>, options?.scope)
			const cacheKey = getScopeCacheKey(scope)
			const existing = descriptorCache.get(cacheKey)
			if (existing) {
				return await existing
			}
			const descriptorPromise = (async () => {
				const subject = await resolveSubject(input)
				return await input.config!.provider.ensureSandbox({
					subject,
					scope,
					gitConfig: options?.gitConfig,
				})
			})()
			descriptorCache.set(cacheKey, descriptorPromise)
			return await descriptorPromise
		},
		async adapter(options) {
			const descriptor = await this.ensure(options)
			const existing = adapterCache.get(descriptor.sandboxId)
			if (existing) {
				return existing
			}
			const adapter = input.config!.provider.createAdapter({ descriptor })
			adapterCache.set(descriptor.sandboxId, adapter)
			return adapter
		},
	}
}
