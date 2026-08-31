import type { RunEvent, Session, TelemetryShim } from '@purista/harness'
import type { EmptyObject } from '../../core/types/EmptyObject.js'
import type { Logger as PuristaLogger } from '../../core/types/Logger.js'
import type { PuristaMetricContext, PuristaMetricDefinitions } from '../../core/types/PuristaMetrics.js'
import type {
	AgentHandlerContext,
	AgentHandlerModelBindings,
	AgentInvokeMap,
	AgentModelBinding,
	AgentRunIdentity,
	AgentSkillContext,
	AllowedAgentDefinition,
	AllowedCommandToolDefinition,
	CommandToolInvokeMap,
} from '../types.js'

export type CreateAgentHandlerContextInput<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, AgentModelBinding>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	payload: Payload
	parameter: Parameter
	identity: AgentRunIdentity
	appContext: Record<string, unknown> & { resources?: Resources }
	metrics?: PuristaMetricContext<Metrics>
	session: Session<any>
	models: AgentHandlerModelBindings<Models>
	skills: AgentSkillContext
	commandTools?: readonly AllowedCommandToolDefinition[]
	agentTools?: readonly AllowedAgentDefinition[]
	serviceName: string
	emitEvent: (event: RunEvent) => Promise<void>
	logger: PuristaLogger
	telemetry: TelemetryShim
	signal: AbortSignal
}

export function createAgentHandlerContext<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, AgentModelBinding>,
	CommandTools extends Record<string, AllowedCommandToolDefinition>,
	AgentTools extends Record<string, AllowedAgentDefinition>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources, Models, Metrics>,
): AgentHandlerContext<Payload, Parameter, Resources, Models, CommandTools, AgentTools, Metrics> {
	const resources = (input.appContext.resources ?? {}) as Resources
	const message = input.appContext.message
	const emit = input.appContext.emit
	const service = input.appContext.service
	const stream = input.appContext.stream
	const queue = input.appContext.queue
	return {
		payload: input.payload,
		parameter: input.parameter,
		identity: input.identity,
		message,
		emit,
		service,
		stream,
		queue,
		resources,
		metrics: (input.metrics ?? {}) as PuristaMetricContext<Metrics>,
		harness: {
			session: input.session,
			models: input.models,
			skills: input.skills,
			events: {
				emit: input.emitEvent,
			},
		},
		telemetry: input.telemetry,
		invoke: {
			tools: createCommandToolInvokeMap(input.appContext.service, input.commandTools ?? []),
			agents: createAgentInvokeMap(input.appContext.service, input.serviceName, input.agentTools ?? []),
		},
		logger: input.logger,
		signal: input.signal,
	}
}

function createCommandToolInvokeMap<Tools extends Record<string, AllowedCommandToolDefinition>>(
	serviceProxy: unknown,
	tools: readonly AllowedCommandToolDefinition[],
): CommandToolInvokeMap<Tools> {
	const result: Record<string, { call(payload: unknown, parameter?: unknown): Promise<unknown> }> = {}
	for (const tool of tools) {
		const key = `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`
		result[key] = {
			call: async (payload, parameter) =>
				callServiceCommand(serviceProxy, tool.serviceName, tool.serviceVersion, tool.commandName, payload, parameter),
		}
	}
	return result as CommandToolInvokeMap<Tools>
}

function createAgentInvokeMap<Agents extends Record<string, AllowedAgentDefinition>>(
	serviceProxy: unknown,
	serviceName: string,
	agents: readonly AllowedAgentDefinition[],
): AgentInvokeMap<Agents> {
	const result: Record<string, { run(payload: unknown, parameter?: unknown): Promise<unknown> }> = {}
	for (const agent of agents) {
		const key = `${agent.agentName}.${agent.serviceVersion}`
		result[key] = {
			run: async (payload, parameter) =>
				callServiceCommand(serviceProxy, serviceName, agent.serviceVersion, agent.agentName, payload, parameter),
		}
	}
	return result as AgentInvokeMap<Agents>
}

async function callServiceCommand(
	serviceProxy: unknown,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	payload: unknown,
	parameter: unknown,
) {
	const serviceNamespace = serviceProxy as Record<string, Record<string, Record<string, unknown>>> | undefined
	const target = serviceNamespace?.[serviceName]?.[serviceVersion]?.[serviceTarget]
	if (typeof target !== 'function') {
		throw new Error(`Agent invoke target "${serviceName}.${serviceVersion}.${serviceTarget}" is not available`)
	}
	return target(payload, parameter)
}
