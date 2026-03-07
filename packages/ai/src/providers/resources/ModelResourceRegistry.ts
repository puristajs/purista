import type { ModelProvider } from '../runtime/ModelProvider.js'

/**
 * Simple registry that maps resource names to provider implementations.
 *
 * @example
 * ```ts
 * const registry = new ModelResourceRegistry()
 * registry.register('anthropic:claude-3', claudeProvider)
 * const provider = registry.get('anthropic:claude-3')
 * ```
 */
export class ModelResourceRegistry {
	private readonly providers = new Map<string, ModelProvider>()

	register(name: string, provider: ModelProvider) {
		this.providers.set(name, provider)
	}

	get(name: string) {
		return this.providers.get(name)
	}

	snapshot() {
		return Array.from(this.providers.keys())
	}
}

/**
 * Default shared registry used by helper services and queue workers.
 * Applications can register additional providers (for example {@link AiSdkProvider})
 * before starting the AI worker/orchestrator services.
 */
export const defaultModelResourceRegistry = new ModelResourceRegistry()
