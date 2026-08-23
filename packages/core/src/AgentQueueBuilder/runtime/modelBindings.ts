import type { ModelAlias, ModelCapability } from '@purista/harness'

import type {
	AgentManifest,
	AgentModelBinding,
	AgentRuntimeModelBindings,
	ResolvedAgentRuntimeModelBindings,
} from '../types.js'

/**
 * Resolves application-owned provider bindings into the Harness model aliases
 * used by one attached agent. Model invocation itself stays in Harness's
 * registry; Core deliberately does not maintain a second wrapper.
 */
export function resolveRuntimeModelBindings<Models extends Record<string, AgentModelBinding>>(
	manifest: AgentManifest<Models>,
	runtimeModels: AgentRuntimeModelBindings<Models>,
): ResolvedAgentRuntimeModelBindings<Models> {
	const resolved: Partial<Record<keyof Models, ModelAlias>> = {}

	for (const [alias, declared] of Object.entries(manifest.models) as Array<
		[keyof Models & string, Models[keyof Models]]
	>) {
		const runtime = runtimeModels[alias]
		if (!runtime) {
			throw new Error(`Missing runtime model binding for agent model alias "${alias}"`)
		}

		const model = runtime.model ?? declared.model
		const detectedCapabilities = runtime.provider.info?.models?.[model]?.capabilities
		const capabilities = runtime.capabilities ?? detectedCapabilities ?? declared.capabilities
		assertCapabilities(alias, declared.capabilities, capabilities)

		resolved[alias] = {
			provider: runtime.provider,
			model,
			capabilities,
			defaults: {
				...declared.defaults,
				...runtime.defaults,
			},
			providerOptions: runtime.providerOptions,
		}
	}

	return resolved as ResolvedAgentRuntimeModelBindings<Models>
}

function assertCapabilities(
	alias: string,
	required: readonly ModelCapability[],
	available: readonly ModelCapability[],
) {
	const missing = required.filter(capability => !available.includes(capability))
	if (missing.length > 0) {
		throw new Error(`Model alias "${alias}" is missing required capabilities: ${missing.join(', ')}`)
	}
}
