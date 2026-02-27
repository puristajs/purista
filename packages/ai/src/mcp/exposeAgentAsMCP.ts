import type { AgentDefinition } from '../types/AgentDefinition.js'

/**
 * Descriptor emitted when an agent should be exposed as an MCP tool.
 */
export type MCPToolDescriptor = {
	name: string
	description?: string
	parameters?: Record<string, unknown>
}

/**
 * Converts an {@link AgentDefinition} into a Model Context Protocol descriptor.
 */
export const exposeAgentAsMCP = (definition: AgentDefinition): MCPToolDescriptor => {
	return {
		name: definition.manifest.agentName,
		description: definition.manifest.description,
		parameters: {
			inputSchema: definition.manifest.payloadSchema,
		},
	}
}
