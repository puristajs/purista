import { DefaultQueueBridge, type EmptyObject, type EventBridge, type QueueBridge } from '@purista/core'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type {
	AgentDefinition,
	AgentInstanceOptions,
	AgentInvokeContext,
	AgentInvokeRequest,
	AgentInvokeResult,
	AgentRuntimeInstance,
} from '../types/AgentDefinition.js'
import {
	getArtifactFrames,
	getFinalAssistantText,
	getFrames,
	getRunStateArtifacts,
	getTelemetryFrames,
	getToolFrames,
} from './protocolTestHelpers.js'
import { testAgent } from './testAgent.js'

export type AgentHarnessResult = AgentInvokeResult & {
	frames: ReturnType<typeof getFrames>
	finalMessage: string
	toolFrames: ReturnType<typeof getToolFrames>
	artifactFrames: ReturnType<typeof getArtifactFrames>
	telemetryFrames: ReturnType<typeof getTelemetryFrames>
	runStateArtifacts: ReturnType<typeof getRunStateArtifacts>
}

export type CreateAgentTestHarnessOptions<
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
> = AgentInstanceOptions<SkillNames, Resources, ConfigInput> & {
	eventBridge?: EventBridge
	queueBridge?: QueueBridge
}

export type AgentStreamHarnessResult = AgentHarnessResult & {
	liveEnvelopes: AgentProtocolEnvelope[]
}

export const createAgentTestHarness = async <
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
>(
	definition: AgentDefinition<SkillNames, Resources, ConfigInput>,
	options = {} as CreateAgentTestHarnessOptions<SkillNames, Resources, ConfigInput>,
): Promise<{
	instance: AgentRuntimeInstance
	eventBridge: EventBridge
	queueBridge?: QueueBridge
	run(request: AgentInvokeRequest, contextOverrides?: Partial<AgentInvokeContext>): Promise<AgentHarnessResult>
	stream(request: AgentInvokeRequest, contextOverrides?: Partial<AgentInvokeContext>): Promise<AgentStreamHarnessResult>
	destroy(): Promise<void>
}> => {
	const queueBridge = options.queueBridge ?? new DefaultQueueBridge()
	const ownedQueueBridge = queueBridge !== undefined && queueBridge !== options.queueBridge
	const { instance, eventBridge, destroy } = await testAgent(definition, {
		...options,
		queueBridge,
	})

	const normalizeResult = (result: AgentInvokeResult): AgentHarnessResult => ({
		...result,
		frames: getFrames(result.envelopes),
		finalMessage: getFinalAssistantText(result.envelopes),
		toolFrames: getToolFrames(result.envelopes),
		artifactFrames: getArtifactFrames(result.envelopes),
		telemetryFrames: getTelemetryFrames(result.envelopes),
		runStateArtifacts: getRunStateArtifacts(result.envelopes),
	})

	return {
		instance,
		eventBridge,
		queueBridge,
		run: async (request, contextOverrides) => normalizeResult(await instance.invoke(request, contextOverrides)),
		stream: async (request, contextOverrides) => {
			const liveEnvelopes: AgentProtocolEnvelope[] = []
			const result = await instance.invoke(
				{
					...request,
					stream: {
						onFrame: async envelope => {
							liveEnvelopes.push(envelope)
							await request.stream?.onFrame?.(envelope)
						},
						onComplete: async () => {
							await request.stream?.onComplete?.()
						},
						onError: async error => {
							await request.stream?.onError?.(error)
						},
					},
				},
				contextOverrides,
			)
			return {
				...normalizeResult(result),
				liveEnvelopes,
			}
		},
		destroy: async () => {
			await destroy()
			if (ownedQueueBridge) {
				await queueBridge?.destroy()
			}
		},
	}
}
