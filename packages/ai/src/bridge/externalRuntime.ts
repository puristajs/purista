import type { AgentInvokeList } from '@purista/core'
import { HandledError, type Schema, StatusCode } from '@purista/core'

import type { AgentHandlerContext } from '../runtime/context.js'
import type { AgentDefinition } from '../types/AgentDefinition.js'
import type {
	AgentManifest,
	AllowedAgentDefinition,
	AllowedToolDefinition,
	ExternalRuntimeMetadata,
} from '../types/AgentManifest.js'

export type ExternalBindingKind = 'command' | 'agent'
export type ExternalResultMode = 'text' | 'object' | 'protocol'

type BindingDescriptor = AllowedToolDefinition | AllowedAgentDefinition

export type ExternalBindingMetadata = {
	kind: ExternalBindingKind
	descriptor: BindingDescriptor & {
		bindingName: string
	}
}

type BaseBinding = {
	name: string
	description?: string
	inputSchema?: Schema
	execute: (payload: unknown) => Promise<unknown>
	externalRuntime: ExternalBindingMetadata
}

export type ExternalCommandBinding = BaseBinding & {
	kind: 'command'
	command: AllowedToolDefinition
}

export type ExternalAgentBinding = BaseBinding & {
	kind: 'agent'
	agent: AllowedAgentDefinition
	resultMode: ExternalResultMode
}

export type ExternalBinding = ExternalCommandBinding | ExternalAgentBinding
export type ExternalBindingSet = Record<string, ExternalBinding>

type BaseBindingFactoryInput = {
	name?: string
	description?: string
}

export type CreateCommandBindingInput = BaseBindingFactoryInput & {
	command: AllowedToolDefinition
	execute: (payload: unknown, parameter?: unknown) => Promise<unknown>
}

export type CreateAgentBindingInput = BaseBindingFactoryInput & {
	agent: AllowedAgentDefinition
	execute: (payload: unknown, parameter?: unknown) => Promise<unknown>
	resultMode?: ExternalResultMode
}

export type CreateExternalBindingsInput = {
	commands?: CreateCommandBindingInput[]
	agents?: CreateAgentBindingInput[]
}

type ExposedCommandInput = AllowedToolDefinition & {
	parameter?: unknown
	name?: string
	description?: string
}

type ExposedAgentInput = AllowedAgentDefinition & {
	parameter?: unknown
	name?: string
	resultMode?: ExternalResultMode
	description?: string
}

export type ExposeHelpers = {
	tool(
		command: AllowedToolDefinition,
		options?: { parameter?: unknown; name?: string; description?: string },
	): ExternalCommandBinding
	agent(
		agent: AllowedAgentDefinition,
		options?: {
			parameter?: unknown
			name?: string
			resultMode?: ExternalResultMode
			description?: string
		},
	): ExternalAgentBinding
	tools(input: { commands?: ExposedCommandInput[]; agents?: ExposedAgentInput[] }): ExternalBindingSet
	metadata(): ExternalRuntimeMetadata
}

type AgentContextLike = Pick<
	AgentHandlerContext<unknown, unknown, Record<string, unknown>, Record<string, never>, string, AgentInvokeList>,
	'manifest' | 'tools' | 'agents' | 'protocol'
>

const getCommandBindingName = (command: AllowedToolDefinition, explicitName?: string) =>
	explicitName ?? command.toolName ?? `${command.serviceName}.${command.serviceVersion}.${command.commandName}`

const getAgentBindingName = (agent: AllowedAgentDefinition, explicitName?: string) =>
	explicitName ?? agent.toolName ?? `${agent.agentName}.${agent.agentVersion}.run`

const ensureSchema = (schema: Schema | undefined) => schema ?? undefined

const extractAssistantText = (
	envelopes: Array<{ frame: { kind: string; role?: string; content?: unknown; final?: boolean } }>,
) => {
	const assistantFrames = envelopes
		.map(envelope => envelope.frame)
		.filter(
			(frame): frame is { kind: 'message'; role: 'assistant'; content: string; final?: boolean } =>
				frame.kind === 'message' && frame.role === 'assistant' && typeof frame.content === 'string',
		)
	if (assistantFrames.length === 0) {
		return ''
	}
	const finalFrame = [...assistantFrames].reverse().find(frame => frame.final === true)
	if (finalFrame?.content.trim()) {
		return finalFrame.content
	}
	return assistantFrames.map(frame => frame.content).join('')
}

export const createCommandBinding = (input: CreateCommandBindingInput): ExternalCommandBinding => {
	const name = getCommandBindingName(input.command, input.name)
	return {
		kind: 'command',
		name,
		description: input.description ?? input.command.description ?? `${name} PURISTA command`,
		inputSchema: ensureSchema(input.command.payloadSchema),
		command: input.command,
		execute: async payload => await input.execute(payload),
		externalRuntime: {
			kind: 'command',
			descriptor: {
				...input.command,
				bindingName: name,
			},
		},
	}
}

export const createAgentBinding = (input: CreateAgentBindingInput): ExternalAgentBinding => {
	const name = getAgentBindingName(input.agent, input.name)
	return {
		kind: 'agent',
		name,
		description: input.description ?? input.agent.description ?? `${name} PURISTA agent`,
		inputSchema: ensureSchema(input.agent.payloadSchema),
		agent: input.agent,
		resultMode: input.resultMode ?? 'text',
		execute: async payload => await input.execute(payload),
		externalRuntime: {
			kind: 'agent',
			descriptor: {
				...input.agent,
				bindingName: name,
			},
		},
	}
}

export const createExternalBindings = (input: CreateExternalBindingsInput): ExternalBindingSet => {
	const result: ExternalBindingSet = {}
	for (const command of input.commands ?? []) {
		const binding = createCommandBinding(command)
		if (binding.name in result) {
			throw new Error(`Duplicate external binding name "${binding.name}"`)
		}
		result[binding.name] = binding
	}
	for (const agent of input.agents ?? []) {
		const binding = createAgentBinding(agent)
		if (binding.name in result) {
			throw new Error(`Duplicate external binding name "${binding.name}"`)
		}
		result[binding.name] = binding
	}
	return result
}

const findAllowedCommand = (context: AgentContextLike, input: AllowedToolDefinition) => {
	const descriptor = context.manifest.allowedTools.find(
		entry =>
			entry.serviceName === input.serviceName &&
			entry.serviceVersion === input.serviceVersion &&
			entry.commandName === input.commandName,
	)
	if (!descriptor) {
		throw new HandledError(
			StatusCode.BadRequest,
			`Command ${input.serviceName}.${input.serviceVersion}.${input.commandName} is not declared via canInvoke(...)`,
		)
	}
	return descriptor
}

const findAllowedAgent = (context: AgentContextLike, input: AllowedAgentDefinition) => {
	const descriptor = (context.manifest.allowedAgents ?? []).find(
		entry => entry.agentName === input.agentName && entry.agentVersion === input.agentVersion,
	)
	if (!descriptor) {
		throw new HandledError(
			StatusCode.BadRequest,
			`Agent ${input.agentName}.${input.agentVersion} is not declared via canInvokeAgent(...)`,
		)
	}
	return descriptor
}

const invokeBoundAgent = async (
	context: AgentContextLike,
	agent: AllowedAgentDefinition,
	options: { parameter?: unknown; name?: string; resultMode?: ExternalResultMode },
	payload: unknown,
) => {
	const bindingName = getAgentBindingName(agent, options.name)
	context.protocol.emitToolEvent({
		toolName: bindingName,
		status: 'invoked',
		input: payload,
	})
	const envelopes = await context.agents.invoke({
		agentName: agent.agentName,
		agentVersion: agent.agentVersion,
		payload,
		parameter: options.parameter,
		emitInvocationToolEvents: false,
	})
	const assistantText = extractAssistantText(envelopes)
	if ((options.resultMode ?? 'text') === 'protocol') {
		context.protocol.emitToolEvent({
			toolName: bindingName,
			status: 'success',
			input: payload,
			output: envelopes,
		})
		return envelopes
	}
	if ((options.resultMode ?? 'text') === 'object') {
		const result = JSON.parse(assistantText) as unknown
		context.protocol.emitToolEvent({
			toolName: bindingName,
			status: 'success',
			input: payload,
			output: result,
		})
		return result
	}
	context.protocol.emitToolEvent({
		toolName: bindingName,
		status: 'success',
		input: payload,
		output: assistantText,
	})
	return assistantText
}

export const createExposeHelpers = (context: AgentContextLike): ExposeHelpers => ({
	metadata() {
		return {
			commands: context.manifest.allowedTools,
			agents: context.manifest.allowedAgents ?? [],
		}
	},
	tool(command, options) {
		const descriptor = {
			...findAllowedCommand(context, command),
			description: command.description ?? options?.description,
			toolName: command.toolName,
		}
		return createCommandBinding({
			command: descriptor,
			name: options?.name,
			description: descriptor.description,
			execute: async payload =>
				await context.tools.invoke[descriptor.serviceName]?.[descriptor.serviceVersion]?.[descriptor.commandName](
					payload,
					options?.parameter,
				),
		})
	},
	agent(agent, options) {
		const descriptor = {
			...findAllowedAgent(context, agent),
			description: agent.description ?? options?.description,
			toolName: agent.toolName,
		}
		return createAgentBinding({
			agent: descriptor,
			name: options?.name,
			description: descriptor.description,
			resultMode: options?.resultMode,
			execute: async payload => await invokeBoundAgent(context, descriptor, options ?? {}, payload),
		})
	},
	tools(input) {
		return createExternalBindings({
			commands: (input.commands ?? []).map(command => ({
				command: {
					...findAllowedCommand(context, command),
					description: command.description,
					toolName: command.toolName,
				},
				name: command.name,
				description: command.description,
				execute: async payload =>
					await context.tools.invoke[command.serviceName]?.[command.serviceVersion]?.[command.commandName](
						payload,
						command.parameter,
					),
			})),
			agents: (input.agents ?? []).map(agent => ({
				agent: {
					...findAllowedAgent(context, agent),
					description: agent.description,
					toolName: agent.toolName,
				},
				name: agent.name,
				description: agent.description,
				resultMode: agent.resultMode,
				execute: async payload => await invokeBoundAgent(context, agent, agent, payload),
			})),
		})
	},
})

export const getExternalRuntimeMetadata = (
	definition: Pick<AgentDefinition, 'getExternalRuntimeMetadata'>,
): ExternalRuntimeMetadata => definition.getExternalRuntimeMetadata()

export const createBindingsMetadata = (manifest: Pick<AgentManifest, 'allowedTools' | 'allowedAgents'>) => ({
	commands: manifest.allowedTools,
	agents: manifest.allowedAgents ?? [],
})
