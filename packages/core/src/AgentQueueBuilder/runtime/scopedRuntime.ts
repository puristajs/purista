import type {
	AgentModelBinding,
	AgentRuntimeOptions,
	AgentRuntimeRef,
	AttachedAgentDefinition,
} from '../types.js'
import { createAgentExecutor } from './executor.js'
import { createAgentConfigurationError } from './errors.js'
import { resolveAgentRuntimeSkills } from './skills.js'

export type AgentRuntimeExecutor<Output = unknown> = NonNullable<AgentRuntimeRef<Output>['current']>

export type AgentRuntimeScope = {
	readonly runtimes: WeakMap<AgentRuntimeRef<any>, AgentRuntimeExecutor<any>>
}

export type AttachedAgentRuntimeShutdown = {
	shutdown(): Promise<void>
}

const boundRuntimeScopes = new WeakMap<object, AgentRuntimeScope>()

export function createAgentRuntimeScope(): AgentRuntimeScope {
	return {
		runtimes: new WeakMap(),
	}
}

export function bindAgentRuntimeScope(owner: object, scope: AgentRuntimeScope): void {
	boundRuntimeScopes.set(owner, scope)
}

export async function initializeAttachedAgentRuntimes(
	scope: AgentRuntimeScope,
	definitions: readonly AttachedAgentDefinition<any>[],
	aiOptions?: AgentRuntimeOptions<Record<string, AgentModelBinding>>,
): Promise<AttachedAgentRuntimeShutdown> {
	if (definitions.length === 0) {
		return { shutdown: async () => undefined }
	}

	if (!aiOptions?.models) {
		throw createAgentConfigurationError('AI attached agents require runtime ai.models in service.getInstance(...) options')
	}

	validateWorkspacePolicies(definitions, aiOptions)

	const executors = await Promise.all(
		definitions.map(async definition => {
			const skillRuntime = await resolveAgentRuntimeSkills(definition.manifest, aiOptions.skills)
			const executor = createAgentExecutor({
				definition,
				manifest: definition.manifest,
				models: aiOptions.models as never,
				storage: aiOptions.storage,
				onSuspended: aiOptions.onSuspended,
				workspace: aiOptions.workspace,
				skillRuntime,
				logger: aiOptions.logger,
				sandbox: aiOptions.sandbox,
				sandboxOptions: aiOptions.sandboxOptions,
				sandboxPolicy: definition.sandboxPolicy,
				telemetry: aiOptions.telemetry,
				governance: aiOptions.governance,
			})
			scope.runtimes.set(definition.runtime, executor)
			return executor
		}),
	)

	return {
		async shutdown() {
			const results = await Promise.allSettled(executors.map(executor => executor.shutdown()))
			const reasons = results
				.filter((result): result is PromiseRejectedResult => result.status === 'rejected')
				.map(result => result.reason)
			if (reasons.length === 1) {
				throw reasons[0]
			}
			if (reasons.length > 1) {
				throw new AggregateError(reasons, `${reasons.length} attached agent runtimes failed to shut down`)
			}
		},
	}
}

function validateWorkspacePolicies(
	definitions: readonly AttachedAgentDefinition<any>[],
	aiOptions: AgentRuntimeOptions<Record<string, AgentModelBinding>>,
): void {
	for (const definition of definitions) {
		if (definition.manifest.durability) {
			if (!aiOptions.storage) {
				throw createAgentConfigurationError(
					`Attached agent "${definition.manifest.agentName}" requires persistent ai.storage in service.getInstance(...) options`,
				)
			}
			if (!aiOptions.storage.capabilities.includes('storage.persistent')) {
				throw createAgentConfigurationError(
					`Attached agent "${definition.manifest.agentName}" requires ai.storage with storage.persistent capability`,
				)
			}
		}
		const policy = definition.manifest.workspacePolicy
		if (policy?.mode !== 'durable') {
			continue
		}

		if (!definition.manifest.durability) {
			throw createAgentConfigurationError(
				`Attached agent "${definition.manifest.agentName}" has a durable workspace without a durability policy`,
			)
		}
		if (!aiOptions.storage || !aiOptions.workspace) {
			throw createAgentConfigurationError(
				`Attached agent "${definition.manifest.agentName}" requires ai.storage and ai.workspace in service.getInstance(...) options`,
			)
		}

		const available = new Set<string>([
			...(aiOptions.storage.capabilities ?? []),
			...(aiOptions.workspace.info.capabilities ?? aiOptions.workspace.capabilities ?? []),
		])
		const missing = (policy.capabilities ?? []).filter(capability => !available.has(capability))
		if (missing.length > 0) {
			throw createAgentConfigurationError(
				`Attached agent "${definition.manifest.agentName}" requires unavailable durable workspace capabilities: ${missing.join(', ')}`,
			)
		}
	}
}

export function getScopedAgentRuntime<Output>(
	scope: AgentRuntimeScope,
	definition: AttachedAgentDefinition<any>,
): AgentRuntimeExecutor<Output> {
	const runtime = scope.runtimes.get(definition.runtime) ?? definition.runtime.current
	if (!runtime) {
		throw createAgentConfigurationError(
			'Attached agent runtime is not initialized. Call service.getInstance(...) before executing the agent.',
		)
	}
	return runtime as AgentRuntimeExecutor<Output>
}

export function getBoundAgentRuntime<Output>(
	owner: object | undefined,
	definition: AttachedAgentDefinition<any>,
): AgentRuntimeExecutor<Output> | undefined {
	if (!owner) {
		return undefined
	}
	const scope = boundRuntimeScopes.get(owner)
	return scope ? getScopedAgentRuntime<Output>(scope, definition) : undefined
}
