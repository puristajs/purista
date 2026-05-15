import type { AgentModelBinding, AgentRuntimeOptions, AgentRuntimeRef, AttachedAgentDefinition } from '../types.js'
import { createAgentExecutor } from './executor.js'

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

	const executors = definitions.map(definition => {
		const executor = createAgentExecutor({
			definition,
			manifest: definition.manifest,
			models: aiOptions.models as never,
			logger: aiOptions.logger,
			stateStore: aiOptions.stateStore,
			sandbox: aiOptions.sandbox ?? definition.manifest.sandbox?.adapter,
			telemetry: aiOptions.telemetry,
		})
		scope.runtimes.set(definition.runtime, executor)
		return executor
	})

	return {
		async shutdown() {
			const results = await Promise.allSettled(executors.map(executor => executor.shutdown()))
			const rejected = results.find((result): result is PromiseRejectedResult => result.status === 'rejected')
			if (rejected) {
				throw rejected.reason
			}
		},
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
