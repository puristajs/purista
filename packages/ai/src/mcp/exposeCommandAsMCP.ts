import type { AgentDefinition } from '../types/AgentDefinition.js'
import { exposeAgentAsMCP, type MCPToolDescriptor } from './exposeAgentAsMCP.js'

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

export type MCPExposeInput<KnowledgeAliases extends string = never> = {
	agents?: Array<AgentDefinition<KnowledgeAliases>>
	commands?: MCPCommandDescriptorInput[]
}

/**
 * Exposes mixed agent + command descriptors as MCP tools.
 * Throws if duplicate tool names are detected.
 */
export const exposeToolsAsMCP = <KnowledgeAliases extends string = never>(
	input: MCPExposeInput<KnowledgeAliases>,
): MCPToolDescriptor[] => {
	const tools = [
		...(input.agents?.map(agent => exposeAgentAsMCP(agent)) ?? []),
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
