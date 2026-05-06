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
	ExtractAgentModels,
} from './types.js'

type MergeModels<A, B> = A & B

type AiInstanceOptions<Models extends Record<string, AgentModelBinding>> = keyof Models extends never
	? { ai?: Partial<AgentRuntimeOptions<Models>> }
	: { ai: AgentRuntimeOptions<Models> }

export type AiServiceInstanceConfig<
	S extends ServiceBuilderTypes,
	Models extends Record<string, AgentModelBinding>,
> = InstanceConfigType<S> & AiInstanceOptions<Models>

/**
 * AI-enabled PURISTA service builder.
 *
 * It keeps agents outside `@purista/core` by expanding every attached agent into
 * normal core queue, queue worker, command, and stream definitions.
 *
 * @example
 * ```ts
 * const service = new ServiceBuilder(info)
 * const agent = await service
 *   .getAgentQueueBuilder('triage', 'Classify tickets')
 *   .addModel('primary', { model: 'gpt-4.1-mini', capabilities: ['object'] })
 *   .setRunFunction(async context => ({ ok: true }))
 *   .getDefinition()
 *
 * service.addAgentDefinition(agent)
 * ```
 */
export class ServiceBuilder<
	S extends ServiceBuilderTypes = ServiceBuilderTypes,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
> extends CoreServiceBuilder<S> {
	private readonly attachedAgents: AttachedAgentDefinition<any>[] = []

	getAgentQueueBuilder<const AgentName extends string>(agentName: AgentName, description: string) {
		return new AgentQueueBuilder<
			AgentQueueBuilderTypes<
				Schema,
				Schema,
				Schema,
				S['Resources'] extends Record<string, unknown> ? S['Resources'] : Record<string, never>
			>
		>(this.info.serviceName, this.info.serviceVersion, agentName, description)
	}

	addAgentDefinition<const Definition extends AttachedAgentDefinition<any>>(...definitions: Definition[]) {
		for (const definition of definitions) {
			this.attachedAgents.push(definition)
			super.addQueueDefinition(definition.queue as never)
			super.addQueueWorkerDefinition(definition.worker as never)
			super.addCommandDefinition(definition.command as never)
			super.addStreamDefinition(definition.stream as never)
		}

		return this as unknown as ServiceBuilder<S, MergeModels<Models, ExtractAgentModels<Definition>>>
	}

	async getInstance(
		eventBridge: EventBridge,
		...args: keyof Models extends never
			? [options?: AiServiceInstanceConfig<S, Models>]
			: [options: AiServiceInstanceConfig<S, Models>]
	) {
		const options = args[0]
		if (this.attachedAgents.length > 0 && !options?.queueBridge) {
			throw new Error('AI attached agents require a queueBridge in service.getInstance(...) options')
		}

		const aiOptions = options?.ai
		for (const definition of this.attachedAgents) {
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

		const service = await super.getInstance(eventBridge, options as InstanceConfigType<S>)
		const shutdownAgents = async () => {
			const results = await Promise.allSettled(
				this.attachedAgents.map(definition => definition.runtime.current?.shutdown()),
			)
			const rejected = results.find((result): result is PromiseRejectedResult => result.status === 'rejected')
			if (rejected) {
				throw rejected.reason
			}
		}
		const destroy = service.destroy.bind(service)
		service.destroy = async () => {
			await shutdownAgents()
			await destroy()
		}
		return service
	}
}
