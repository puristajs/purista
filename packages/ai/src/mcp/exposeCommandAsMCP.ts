import type { AgentDefinition } from '../types/AgentDefinition.js'
import { exposeAgentAsMCP, exposeAgentAsMCPFromManifest, type MCPToolDescriptor } from './exposeAgentAsMCP.js'

export type MCPCommandDescriptorInput = {
	serviceName: string
	serviceVersion: string
	commandName: string
	description?: string
	payloadSchema?: unknown
	toolName?: string
}

const toCommandToolName = (input: MCPCommandDescriptorInput) =>
	input.toolName ?? `${input.serviceName}.${input.serviceVersion}.${input.commandName}`

/**
 * Converts a PURISTA command into an MCP tool descriptor.
 */
export const exposeCommandAsMCP = (input: MCPCommandDescriptorInput): MCPToolDescriptor => ({
	name: toCommandToolName(input),
	description: input.description,
	parameters: {
		inputSchema: input.payloadSchema,
	},
})

/**
 * Converts multiple PURISTA commands into MCP tool descriptors.
 */
export const exposeCommandsAsMCP = (inputs: MCPCommandDescriptorInput[]): MCPToolDescriptor[] =>
	inputs.map(exposeCommandAsMCP)

export type MCPManifestInput = {
	agentName: string
	description?: string
	payloadSchema?: unknown
}

export type MCPExposeInput = {
	agents?: (AgentDefinition | { manifest: MCPManifestInput })[]
	commands?: MCPCommandDescriptorInput[]
}

/**
 * Exposes mixed agent + command descriptors as MCP tools.
 * Throws if duplicate tool names are detected.
 */
export const exposeToolsAsMCP = (input: MCPExposeInput): MCPToolDescriptor[] => {
	const tools = [
		...(input.agents?.map(agent => {
			if ('manifest' in agent && 'agentName' in agent.manifest) {
				return exposeAgentAsMCPFromManifest(agent.manifest)
			}
			return exposeAgentAsMCP(agent as AgentDefinition)
		}) ?? []),
		...exposeCommandsAsMCP(input.commands ?? []),
	]

	const used = new Set<string>()
	for (const tool of tools) {
		if (used.has(tool.name)) {
			throw new Error(`Duplicate MCP tool name "${tool.name}"`)
		}
		used.add(tool.name)
	}
	return tools
}
