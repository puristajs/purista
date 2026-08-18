import type {
	AgentModelBinding,
	AgentRuntimeOptions,
	AgentRuntimeRef,
	AgentSandboxPolicy,
	AttachedAgentDefinition,
} from '../types.js'
import { createAgentExecutor } from './executor.js'
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
		throw new Error('AI attached agents require runtime ai.models in service.getInstance(...) options')
	}

	validateWorkspacePolicies(definitions, aiOptions)

	const executors = await Promise.all(
		definitions.map(async definition => {
			const skillRuntime = await resolveAgentRuntimeSkills(definition.manifest, aiOptions.skills)
			const executor = createAgentExecutor({
				definition,
				manifest: definition.manifest,
				models: aiOptions.models as never,
				runtime: aiOptions.runtime,
				workspaceStore: aiOptions.workspaceStore,
				harness: aiOptions.harness,
				skillRuntime,
				logger: aiOptions.logger,
				stateStore: aiOptions.stateStore,
				sandbox: resolveAttachedAgentSandbox(definition.manifest.sandbox, aiOptions.sandbox),
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

/**
 * Resolve the sandbox an attached agent should run with.
 *
 * Sandboxing is opt-in per agent: an explicit `enabled: false` disables it even
 * when a shared `ai.sandbox` is configured, a policy-provided adapter takes
 * precedence over the shared sandbox, and agents without a sandbox policy fall
 * back to the shared `ai.sandbox`.
 */
export function resolveAttachedAgentSandbox(
	policy: AgentSandboxPolicy | undefined,
	runtimeSandbox: AgentRuntimeOptions<Record<string, AgentModelBinding>>['sandbox'],
) {
	if (!policy) {
		return runtimeSandbox
	}
	if (policy.enabled === false) {
		return undefined
	}
	return policy.adapter ?? runtimeSandbox
}

function validateWorkspacePolicies(
	definitions: readonly AttachedAgentDefinition<any>[],
	aiOptions: AgentRuntimeOptions<Record<string, AgentModelBinding>>,
): void {
	for (const definition of definitions) {
		const policy = definition.manifest.workspacePolicy
		if (policy?.mode !== 'durable') {
			continue
		}

		if (!aiOptions.runtime || !aiOptions.workspaceStore) {
			if (policy.required === false) {
				continue
			}
			throw new Error(
				`Attached agent "${definition.manifest.agentName}" requires durable ai.runtime and ai.workspaceStore in service.getInstance(...) options`,
			)
		}

		const available = new Set<string>([
			...(aiOptions.runtime?.capabilities ?? []),
			...(aiOptions.workspaceStore?.info?.capabilities ?? aiOptions.workspaceStore?.capabilities ?? []),
		])
		const missing = (policy.capabilities ?? []).filter(capability => !available.has(capability))
		if (missing.length > 0) {
			throw new Error(
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
		throw new Error(
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
