import type { AgentRuntimeInstance, AgentRuntimeStatus } from '../types/AgentDefinition.js'

/**
 * Returns a stable status snapshot for one or many running agent instances.
 */
export const getAgentRuntimeStatuses = (
	instances: Record<string, AgentRuntimeInstance> | AgentRuntimeInstance[],
): AgentRuntimeStatus[] => {
	const list = Array.isArray(instances) ? instances : Object.values(instances)
	return list.map(instance => instance.getStatus())
}
