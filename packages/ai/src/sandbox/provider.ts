import { createHash } from 'node:crypto'
import type { EventBridge } from '@purista/core'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import type { AgentInvocationIdentity } from '../runtime/invocationIdentity.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createPuristaSandboxAdapter, type SandboxAdapter } from './adapter/BashTool/createPuristaSandboxAdapter.js'
import type { SandboxRegistry } from './resources/SandboxRegistry.js'
import type { SandboxDriver, SandboxMetadata, SandboxScope } from './types/SandboxDriver.js'

const NonEmptyIdentifierSchema = z.string().min(1)

export const SandboxSubjectSchema = z.object({
	tenantId: NonEmptyIdentifierSchema,
	principalId: NonEmptyIdentifierSchema,
	projectId: NonEmptyIdentifierSchema,
})

export type SandboxSubject = z.infer<typeof SandboxSubjectSchema>

export const agentSandboxScopeKinds = [
	'shared-project-user',
	'conversation',
	'agent-run',
	'agent-instance',
	'runtime-instance',
] as const

export const AgentSandboxScopeKindSchema = z.enum(agentSandboxScopeKinds)

export type AgentSandboxScopeKind = z.infer<typeof AgentSandboxScopeKindSchema>

export const AgentSandboxPolicySchema = z.object({
	mode: z.enum(['disabled', 'optional', 'required']),
	scope: AgentSandboxScopeKindSchema,
})

export type AgentSandboxPolicy = z.infer<typeof AgentSandboxPolicySchema>

export const SandboxDescriptorSchema = z.object({
	sandboxId: NonEmptyIdentifierSchema,
	subject: SandboxSubjectSchema,
	scope: z
		.discriminatedUnion('kind', [
			z.object({ kind: z.literal('shared-project-user') }),
			z.object({ kind: z.literal('agent-run'), key: NonEmptyIdentifierSchema }),
			z.object({ kind: z.literal('agent-instance'), key: NonEmptyIdentifierSchema }),
			z.object({ kind: z.literal('conversation'), key: NonEmptyIdentifierSchema }),
			z.object({ kind: z.literal('runtime-instance'), key: NonEmptyIdentifierSchema }),
			z.object({ kind: z.literal('custom'), key: NonEmptyIdentifierSchema }),
		])
		.optional(),
	status: z.enum(['ready', 'starting', 'failed']),
	created: z.boolean(),
})

export type SandboxDescriptor = z.infer<typeof SandboxDescriptorSchema>

export type SandboxProviderEnsureInput = {
	subject: SandboxSubject
	scope?: SandboxScope
	gitConfig?: {
		username: string
		email: string
		token?: string
	}
}

export type SandboxProviderCreateAdapterInput = {
	descriptor: SandboxDescriptor
}

export interface SandboxProvider {
	ensureSandbox(input: SandboxProviderEnsureInput): Promise<SandboxDescriptor>
	createAdapter(input: SandboxProviderCreateAdapterInput): SandboxAdapter
	destroySandbox?(input: SandboxProviderCreateAdapterInput): Promise<void>
}

export type { SandboxAdapter }

export type SandboxSubjectResolverInput<Resources extends Record<string, unknown> = Record<string, unknown>> = {
	payload: unknown
	parameter: unknown
	message: {
		tenantId?: string
		principalId?: string
	}
	identity?: AgentInvocationIdentity
	manifest: AgentManifest
	resources: Resources
}

export type SandboxSubjectResolver<Resources extends Record<string, unknown> = Record<string, unknown>> = (
	input: SandboxSubjectResolverInput<Resources>,
) => SandboxSubject | Promise<SandboxSubject>

export type AgentSandboxRuntimeConfig<Resources extends Record<string, unknown> = Record<string, unknown>> = {
	provider: SandboxProvider
	resolveSubject: SandboxSubjectResolver<Resources>
}

const toMetadataOwner = (subject: SandboxSubject) => ({
	organizationId: subject.tenantId,
	projectId: subject.projectId,
	userId: subject.principalId,
})

const toDescriptor = (
	subject: SandboxSubject,
	scope: SandboxScope | undefined,
	input: { sandboxId: string; status: 'ready' | 'starting' | 'failed'; created: boolean },
): SandboxDescriptor => ({
	sandboxId: input.sandboxId,
	subject,
	scope,
	status: input.status,
	created: input.created,
})

const getScopeKey = (scope?: SandboxScope) => {
	if (!scope || scope.kind === 'shared-project-user') {
		return 'shared-project-user'
	}
	return `${scope.kind}:${scope.key}`
}

const createDeterministicSandboxId = (input: SandboxSubject & { scope?: SandboxScope }) => {
	const hash = createHash('sha256')
		.update(`${input.tenantId}:${input.projectId}:${input.principalId}:${getScopeKey(input.scope)}`)
		.digest('hex')
	return `sb-${hash.slice(0, 32)}`
}

const ensureProjectAccess = (subject: SandboxSubject, metadata: SandboxMetadata) => {
	if (
		metadata.organizationId !== subject.tenantId ||
		metadata.userId !== subject.principalId ||
		metadata.projectId !== subject.projectId
	) {
		throw new HandledError(StatusCode.Forbidden, 'Caller is not allowed to access this sandbox.', {
			sandboxId: metadata.sandboxId,
			tenantId: subject.tenantId,
			principalId: subject.principalId,
			projectId: subject.projectId,
		})
	}
}

export const createPuristaSandboxProvider = (eventBridge: EventBridge): SandboxProvider => ({
	async ensureSandbox(input) {
		const ensured = await eventBridge.invoke<{
			sandboxId: string
			status: 'ready' | 'starting' | 'failed'
			created: boolean
		}>({
			sender: {
				serviceName: 'SandboxProvider',
				serviceVersion: '1',
				serviceTarget: 'ensureSandbox',
				instanceId: '1',
			},
			receiver: {
				serviceName: 'Sandbox',
				serviceVersion: '1',
				serviceTarget: 'ensureSandbox',
			},
			payload: {
				payload: {
					projectId: input.subject.projectId,
					scope: input.scope,
					gitConfig: input.gitConfig,
				},
				parameter: {},
			},
			tenantId: input.subject.tenantId,
			principalId: input.subject.principalId,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		})

		return toDescriptor(input.subject, input.scope, ensured)
	},
	createAdapter(input) {
		return createPuristaSandboxAdapter(eventBridge, {
			sandboxId: input.descriptor.sandboxId,
			projectId: input.descriptor.subject.projectId,
			tenantId: input.descriptor.subject.tenantId,
			principalId: input.descriptor.subject.principalId,
		})
	},
	async destroySandbox(input) {
		await eventBridge.invoke({
			sender: {
				serviceName: 'SandboxProvider',
				serviceVersion: '1',
				serviceTarget: 'destroySandbox',
				instanceId: '1',
			},
			receiver: {
				serviceName: 'Sandbox',
				serviceVersion: '1',
				serviceTarget: 'destroySandbox',
			},
			payload: {
				payload: {
					sandboxId: input.descriptor.sandboxId,
					projectId: input.descriptor.subject.projectId,
				},
				parameter: {},
			},
			tenantId: input.descriptor.subject.tenantId,
			principalId: input.descriptor.subject.principalId,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		})
	},
})

export const createInProcessSandboxProvider = (input: {
	driver: SandboxDriver
	registry: SandboxRegistry
}): SandboxProvider => ({
	async ensureSandbox(request) {
		const owner = {
			...toMetadataOwner(request.subject),
			scope: request.scope,
		}
		return await input.registry.withOwnerProvisionLock(owner, async () => {
			const existing = await input.registry.findByOwner(owner)
			if (existing) {
				return toDescriptor(request.subject, request.scope, {
					sandboxId: existing.sandboxId,
					status: 'ready',
					created: false,
				})
			}

			const sandboxId = createDeterministicSandboxId({
				...request.subject,
				scope: request.scope,
			})
			const created = await input.driver.createSandbox({
				...owner,
				sandboxId,
				gitConfig: request.gitConfig,
			})
			await input.registry.register({
				...owner,
				sandboxId,
				containerName: created.containerName,
				createdAt: Date.now(),
				gitConfigured: !!request.gitConfig,
			})
			return toDescriptor(request.subject, request.scope, {
				sandboxId,
				status: 'starting',
				created: true,
			})
		})
	},
	createAdapter({ descriptor }) {
		return {
			async executeCommand(command, options) {
				const metadata = await input.registry.getMetadata(descriptor.sandboxId)
				if (!metadata) {
					throw new HandledError(StatusCode.NotFound, `Sandbox ${descriptor.sandboxId} not found in registry`)
				}
				ensureProjectAccess(descriptor.subject, metadata)
				return await input.driver.executeBash({
					sandboxId: descriptor.sandboxId,
					command,
					cwd: options?.cwd,
					timeoutMs: options?.timeoutMs,
				})
			},
			async readFile(path) {
				const metadata = await input.registry.getMetadata(descriptor.sandboxId)
				if (!metadata) {
					throw new HandledError(StatusCode.NotFound, `Sandbox ${descriptor.sandboxId} not found in registry`)
				}
				ensureProjectAccess(descriptor.subject, metadata)
				return await input.driver.readFile({ sandboxId: descriptor.sandboxId, path })
			},
			async writeFiles(files) {
				const metadata = await input.registry.getMetadata(descriptor.sandboxId)
				if (!metadata) {
					throw new HandledError(StatusCode.NotFound, `Sandbox ${descriptor.sandboxId} not found in registry`)
				}
				ensureProjectAccess(descriptor.subject, metadata)
				await input.driver.writeFiles({
					sandboxId: descriptor.sandboxId,
					files: Object.fromEntries(
						files.map(file => [
							file.path,
							typeof file.content === 'string'
								? { encoding: 'utf-8' as const, content: file.content }
								: { encoding: 'base64' as const, content: file.content.toString('base64') },
						]),
					),
				})
			},
		}
	},
	async destroySandbox({ descriptor }) {
		const metadata = await input.registry.getMetadata(descriptor.sandboxId)
		if (!metadata) {
			return
		}
		ensureProjectAccess(descriptor.subject, metadata)
		await input.driver.destroySandbox({ sandboxId: descriptor.sandboxId })
		await input.registry.unregister(descriptor.sandboxId)
	},
})
