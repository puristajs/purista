import type { ConfigSetterFunction } from '@purista/core'

import type { AgentDefinition } from '../types/AgentDefinition.js'

/**
 * Publishes a built agent manifest to a managed config store.
 *
 * @example
 * ```ts
 * const definition = new AgentBuilder({ agentName: 'planner', serviceVersion: '1' }).build()
 * await publishAgentManifest(service.configs.setConfig.bind(service.configs), definition)
 * ```
 */
export const publishAgentManifest = async (configSetter: ConfigSetterFunction, definition: AgentDefinition) => {
	const configKey = `ai.manifest.${definition.manifest.agentName}.${definition.manifest.serviceVersion}`
	await configSetter(configKey, definition.manifest)
	return {
		configKey,
		manifest: definition.manifest,
	}
}
