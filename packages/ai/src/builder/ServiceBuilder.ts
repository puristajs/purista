import {
	ServiceBuilder as CoreServiceBuilder,
	type EventBridge,
	type InstanceConfigType,
	type Schema,
	type ServiceBuilderTypes,
} from '@purista/core'

import { createAgentExecutor } from '../runtime/executor.js'
import { AgentQueueBuilder } from './AgentQueueBuilder.js'
import type {
	AgentModelBinding,
	AgentQueueBuilderTypes,
	AgentRuntimeOptions,
	AttachedAgentDefinition,
} from './types.js'

export type AiServiceInstanceConfig<S extends ServiceBuilderTypes> = InstanceConfigType<S> & {
	ai?: AgentRuntimeOptions<Record<string, AgentModelBinding>>
}

declare module '@purista/core' {
	interface ServiceBuilder<S extends ServiceBuilderTypes = ServiceBuilderTypes> {
		getAgentQueueBuilder<const AgentName extends string>(
			agentName: AgentName,
			description: string,
		): AgentQueueBuilder<
			AgentQueueBuilderTypes<
				Schema,
				Schema,
				Schema,
				S['Resources'] extends Record<string, unknown> ? S['Resources'] : Record<string, never>
			>
		>

		addAgentDefinition<const Definition extends AttachedAgentDefinition<any>>(...definitions: Definition[]): this

		getInstance(eventBridge: EventBridge, options?: AiServiceInstanceConfig<S>): Promise<S['ServiceClassType']>
	}
}

const attachedAgents = new WeakMap<CoreServiceBuilder<any>, AttachedAgentDefinition<any>[]>()
const aiPatched = Symbol.for('@purista/ai:core-service-builder-patched')
const prototype = CoreServiceBuilder.prototype as CoreServiceBuilder<any> & {
	[aiPatched]?: boolean
	getAgentQueueBuilder?: (agentName: string, description: string) => AgentQueueBuilder<any>
	addAgentDefinition?: (...definitions: AttachedAgentDefinition<any>[]) => CoreServiceBuilder<any>
}

if (!prototype[aiPatched]) {
	const getCoreInstance = CoreServiceBuilder.prototype.getInstance

	prototype.getAgentQueueBuilder = function getAgentQueueBuilder(agentName: string, description: string) {
		return new AgentQueueBuilder(this.info.serviceName, this.info.serviceVersion, agentName, description)
	}

	prototype.addAgentDefinition = function addAgentDefinition(...definitions: AttachedAgentDefinition<any>[]) {
		const existing = attachedAgents.get(this) ?? []
		existing.push(...definitions)
		attachedAgents.set(this, existing)

		for (const definition of definitions) {
			this.addQueueDefinition(definition.queue as never)
			this.addQueueWorkerDefinition(definition.worker as never)
			this.addCommandDefinition(definition.command as never)
			this.addStreamDefinition(definition.stream as never)
		}

		return this
	}

	CoreServiceBuilder.prototype.getInstance = async function getInstanceWithAi(
		this: CoreServiceBuilder<any>,
		eventBridge: EventBridge,
		options?: AiServiceInstanceConfig<any>,
	) {
		const agents = attachedAgents.get(this) ?? []
		if (agents.length > 0 && !options?.queueBridge) {
			throw new Error('AI attached agents require a queueBridge in service.getInstance(...) options')
		}

		const aiOptions = options?.ai
		for (const definition of agents) {
			if (!aiOptions?.models) {
				throw new Error('AI attached agents require runtime ai.models in service.getInstance(...) options')
			}
			definition.runtime.current = createAgentExecutor({
				definition,
				manifest: definition.manifest,
				models: aiOptions.models as never,
				logger: aiOptions.logger ?? options?.logger,
				stateStore: aiOptions.stateStore,
				sandbox: aiOptions.sandbox ?? definition.manifest.sandbox?.adapter,
				telemetry: aiOptions.telemetry,
			})
		}

		const service = await getCoreInstance.call(this, eventBridge, options)
		const destroy = service.destroy.bind(service)
		service.destroy = async () => {
			const results = await Promise.allSettled(agents.map(definition => definition.runtime.current?.shutdown()))
			const rejected = results.find((result): result is PromiseRejectedResult => result.status === 'rejected')
			if (rejected) {
				throw rejected.reason
			}
			await destroy()
		}
		return service
	}

	prototype[aiPatched] = true
}
