import type { EmptyObject, EventBridge } from '@purista/core'
import { DefaultEventBridge } from '@purista/core'
import type { AgentDefinition, AgentInstanceOptions, AgentRuntimeInstance } from '../types/AgentDefinition.js'

type TestAgentOptions<
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
> = AgentInstanceOptions<SkillNames, Resources, ConfigInput> & {
	eventBridge?: EventBridge
}

export const testAgent = async <
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
>(
	definition: AgentDefinition<SkillNames, Resources, ConfigInput>,
	options: TestAgentOptions<SkillNames, Resources, ConfigInput> = {},
): Promise<{
	instance: AgentRuntimeInstance
	eventBridge: EventBridge
	destroy: () => Promise<void>
}> => {
	const ownedEventBridge = !options.eventBridge
	const eventBridge = options.eventBridge ?? new DefaultEventBridge()
	if (ownedEventBridge) {
		await eventBridge.start()
	}
	const instanceOptions = { ...options }
	delete (instanceOptions as { eventBridge?: EventBridge }).eventBridge
	const instance = await definition.getInstance(eventBridge, instanceOptions)
	await instance.start()
	return {
		instance,
		eventBridge,
		destroy: async () => {
			await instance.stop()
			if (ownedEventBridge) {
				await eventBridge.destroy()
			}
		},
	}
}
