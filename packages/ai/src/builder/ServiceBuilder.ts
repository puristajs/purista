import type {
	InstanceConfigType as CoreServiceInstanceOptions,
	EmptyObject,
	ExtractAgentModels,
	Schema,
	ServiceBuilderTypes,
	SetNewTypeValue,
	SetNewTypeValues,
} from '@purista/core'
import { ServiceBuilder as ServiceBuilderCore } from '@purista/core'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentInstance } from '../runtime/AgentInstance.js'
import type { AgentSandboxRuntimeConfig } from '../sandbox/provider.js'
import type { SkillResource, SkillSourceMap } from '../skills/fileSystem.js'
import type { AgentInstanceOptions } from '../types/AgentDefinition.js'
import type { AgentQueueBuilderTypes, AgentQueueDefinitionResult } from './AgentQueueBuilder.js'
import { AgentQueueBuilder } from './AgentQueueBuilder.js'

export type ServiceAiConfig<
	AgentModels extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentSkills extends SkillSourceMap<string> | SkillResource = SkillResource,
> = (keyof AgentModels extends never
	? {
			model?: never
		}
	: {
			model: {
				[K in keyof AgentModels]: AgentModels[K]
			}
		}) & {
	skills?: AgentSkills
	conversationStore?: ConversationStore
	poolManager?: PoolManager
	poolConfig?: {
		poolId?: string
		maxConcurrencyPerInstance?: number
	}
	sandbox?: AgentSandboxRuntimeConfig<Record<string, unknown>>
}

type ModelsFromAgentDefinition<Definition> = Definition extends { __agentTypes?: infer Models }
	? Models extends Record<string, ModelProvider>
		? Models
		: EmptyObject
	: EmptyObject

type NormalizeModelMap<T extends Record<string, unknown>> = string extends keyof T
	? T[string] extends never
		? EmptyObject
		: T
	: T

type ExistingServiceAgentModels<S extends ServiceBuilderTypes> =
	ExtractAgentModels<S['AgentDefinitions']> extends Record<string, ModelProvider>
		? NormalizeModelMap<ExtractAgentModels<S['AgentDefinitions']>>
		: EmptyObject

type NextServiceAgentModels<S extends ServiceBuilderTypes, Definition> = ExistingServiceAgentModels<S> &
	ModelsFromAgentDefinition<Definition>

type ApplyServiceAgentDefinition<S extends ServiceBuilderTypes, Definition> = SetNewTypeValues<
	SetNewTypeValue<
		S,
		'AgentDefinitions',
		{
			__hasAgents: true
			Models: NextServiceAgentModels<S, Definition>
		}
	>,
	{
		AiConfig: ServiceAiConfig<NextServiceAgentModels<S, Definition>>
	}
>

type InstanceConfigBase = {
	logLevel?: import('@purista/core').LogLevelName
	logger?: import('@purista/core').Logger
	spanProcessor?: import('@opentelemetry/sdk-trace-node').SpanProcessor
	secretStore?: import('@purista/core').SecretStore
	configStore?: import('@purista/core').ConfigStore
	stateStore?: import('@purista/core').StateStore
	queueBridge?: import('@purista/core').QueueBridge
}

type ServiceGetInstanceOptions = InstanceConfigBase & {
	ai?: ServiceAiConfig
	serviceConfig?: Record<string, unknown>
	resources?: Record<string, unknown>
}

type ServiceBuilderGetInstanceOptions<S extends ServiceBuilderTypes> = CoreServiceInstanceOptions<S> &
	(S['AgentDefinitions'] extends { __hasAgents: true } ? { ai: S['AiConfig'] } : { ai?: never })

type AgentRuntimeOptions = AgentInstanceOptions<string, Record<string, unknown>>

const attachedAgentsSymbol = Symbol.for('@purista/ai/attachedAgentInstances')
const hasAiWrappedDestroySymbol = Symbol.for('@purista/ai/hasWrappedDestroy')

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const toModelProviders = <AgentModels extends Record<string, ModelProvider>>(
	models: { [K in keyof AgentModels]: AgentModels[K] } | undefined,
): Record<string, ModelProvider> | undefined => {
	if (!models) {
		return undefined
	}
	const entries = Object.entries(models).filter((entry): entry is [string, ModelProvider] => {
		return entry[1] !== undefined
	})
	if (entries.length === 0) {
		return undefined
	}
	return Object.fromEntries(entries)
}

const stripAiFromGetInstanceOptions = (options: unknown): unknown => {
	if (!isRecord(options)) {
		return options
	}
	const { ai: _ai, ...serviceOptions } = options
	return serviceOptions
}

const toAgentRuntimeOptions = (
	aiConfig: ServiceAiConfig,
	serviceOptions?: InstanceConfigBase & { resources?: Record<string, unknown> },
): AgentRuntimeOptions => {
	const modelProviders = toModelProviders(aiConfig.model)
	const mergedResources = {
		...(serviceOptions?.resources ?? {}),
	}
	return {
		...(serviceOptions?.logger ? { logger: serviceOptions.logger } : {}),
		...(serviceOptions?.spanProcessor ? { spanProcessor: serviceOptions.spanProcessor } : {}),
		...(serviceOptions?.secretStore ? { secretStore: serviceOptions.secretStore } : {}),
		...(serviceOptions?.configStore ? { configStore: serviceOptions.configStore } : {}),
		...(serviceOptions?.stateStore ? { stateStore: serviceOptions.stateStore } : {}),
		...(serviceOptions?.queueBridge ? { queueBridge: serviceOptions.queueBridge } : {}),
		...(Object.keys(mergedResources).length > 0 ? { resources: mergedResources } : {}),
		...(aiConfig.sandbox ? { sandbox: aiConfig.sandbox } : {}),
		...(modelProviders ? { models: modelProviders } : {}),
		...(aiConfig.skills ? { skills: aiConfig.skills } : {}),
		...(aiConfig.conversationStore ? { conversationStore: aiConfig.conversationStore } : {}),
		...(aiConfig.poolManager ? { poolManager: aiConfig.poolManager } : {}),
		...(aiConfig.poolConfig ? { poolConfig: aiConfig.poolConfig } : {}),
	}
}

const attachAgentLifecycle = (service: object, agents: AgentInstance[]) => {
	const s = service as {
		destroy: () => Promise<void>
		[attachedAgentsSymbol]?: AgentInstance[]
		[hasAiWrappedDestroySymbol]?: boolean
	}

	s[attachedAgentsSymbol] = agents

	if (s[hasAiWrappedDestroySymbol]) {
		return
	}

	const originalDestroy = s.destroy.bind(service)
	s.destroy = async () => {
		await Promise.allSettled(agents.map(async instance => await instance.stop()))
		await originalDestroy()
	}
	s[hasAiWrappedDestroySymbol] = true
}

export class ServiceBuilder<S extends ServiceBuilderTypes = ServiceBuilderTypes> extends ServiceBuilderCore<S> {
	getAgentQueueBuilder<Models extends Record<string, ModelProvider> = EmptyObject>(
		agentName: string,
		description?: string,
		successEventName?: string,
	): AgentQueueBuilder<AgentQueueBuilderTypes<Schema, Schema, Schema, EmptyObject, Models>> {
		return AgentQueueBuilder.fromServiceBuilder(
			this,
			agentName,
			description,
			successEventName,
		) as unknown as AgentQueueBuilder<AgentQueueBuilderTypes<Schema, Schema, Schema, EmptyObject, Models>>
	}

	// biome-ignore lint/suspicious/noTsIgnore: core dist still exposes a narrower addAgentDefinition return type than the source typings
	// @ts-ignore core dist still exposes a narrower addAgentDefinition return type than the source typings
	addAgentDefinition<Definitions extends import('@purista/core').AgentQueueDefinitionList>(
		...agentDefinitions: Definitions
	): ServiceBuilder<ApplyServiceAgentDefinition<S, Awaited<Definitions[number]>>> {
		super.addAgentDefinition(...agentDefinitions)
		return this as unknown as ServiceBuilder<ApplyServiceAgentDefinition<S, Awaited<Definitions[number]>>>
	}

	async getInstance(
		eventBridge: Parameters<ServiceBuilderCore<S>['getInstance']>[0],
		options?: ServiceBuilderGetInstanceOptions<S>,
	): Promise<S['ServiceClassType']> {
		const typedOptions = options as ServiceGetInstanceOptions | undefined
		const aiConfig = typedOptions?.ai
		const serviceOptions = stripAiFromGetInstanceOptions(options) as CoreServiceInstanceOptions<S>
		const service = await super.getInstance(eventBridge, serviceOptions)

		if (!aiConfig) {
			return service as S['ServiceClassType']
		}

		const resolvedDefinitions = await this.resolveDefinitions()
		const agentInstances: AgentInstance[] = []
		const agentOptions = toAgentRuntimeOptions(aiConfig, typedOptions)

		for (const agentDef of resolvedDefinitions.agents as AgentQueueDefinitionResult[]) {
			const agentInstance = await agentDef.getInstance(eventBridge, agentOptions)
			await agentInstance.start()
			agentInstances.push(agentInstance)
		}

		if (agentInstances.length > 0) {
			attachAgentLifecycle(service as object, agentInstances)
		}

		return service as S['ServiceClassType']
	}
}

export { AgentQueueBuilder }
