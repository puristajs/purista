import { DefaultEventBridge } from '@purista/core'
import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod/v4'

import { EchoProvider } from '../providers/runtime/ModelProvider.js'
import { AgentBuilder } from './AgentBuilder.js'

const bridges: DefaultEventBridge[] = []

afterEach(async () => {
	for (const bridge of bridges.splice(0)) {
		await bridge.destroy()
	}
})

describe('AgentBuilder', () => {
	it('requires a non-empty agent name', () => {
		expect(() => new AgentBuilder({ agentName: '', agentVersion: '1' })).toThrow('Agent name is required')
	})

	it('requires exposeAsHttpEndpoint before setStreamingMode', () => {
		const builder = new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
		expect(() => builder.setStreamingMode('sse')).toThrow(
			'Call exposeAsHttpEndpoint before configuring the streaming mode',
		)
	})

	it('supports manifest mutation helpers and requires a handler before build()', () => {
		const payloadSchema = z.object({ prompt: z.string() })
		const parameterSchema = z.object({ locale: z.string().optional() })
		const outputSchema = z.object({ message: z.string() })
		const contextSchema = z.object({ requestId: z.string().optional() })

		const builder = new AgentBuilder({ agentName: 'helperAgent', agentVersion: '1' })
			.setDescription('helper description')
			.useEventBridge('customBridge')
			.useResource('llm', { resourceName: 'model' })
			.useSessionStore({ storeName: 'sessions', maxFrames: 20 })
			.useKnowledgeAdapter({ adapterName: 'knowledge', options: { topK: 3 } })
			.setRuntime('worker')
			.setModelResource({ resourceName: 'modelResource', variant: 'mini' })
			.setRetryPolicy({ maxAttempts: 2, strategy: 'fixed', delayMs: 100 })
			.setMemory({ storeName: 'memoryStore', maxFrames: 10 })
			.setKnowledge([{ adapterName: 'knowledge2', options: { topK: 1 } }])
			.allowTool({ serviceName: 'ToolService', serviceVersion: '1', commandName: 'run' })
			.setTelemetry({ attributes: { team: 'support' } })
			.setEvaluation({ suite: 'smoke' })
			.addPayloadSchema(payloadSchema)
			.setInputSchema(payloadSchema)
			.addParameterSchema(parameterSchema)
			.addOutputSchema(outputSchema)
			.addContextSchema(contextSchema)
			.setContextSchema(contextSchema)
			.exposeAsHttpEndpoint('POST', 'agents/helperAgent')
			.makeEndpointPublic()

		expect(() => builder.build()).toThrow('Agent handler is required. Call setHandler() before build().')

		const definition = builder.setHandler(async () => ({ message: 'ok' })).build()
		const manifest = definition.getManifest()
		expect(manifest.description).toBe('helper description')
		expect(manifest.eventBridge).toBe('customBridge')
		expect(manifest.resources?.llm?.resourceName).toBe('model')
		expect(manifest.session?.storeName).toBe('memoryStore')
		expect(manifest.knowledge?.[0]?.adapterName).toBe('knowledge2')
		expect(manifest.modelResource?.variant).toBe('mini')
		expect(manifest.allowedTools).toHaveLength(1)
		expect(manifest.telemetry?.attributes?.team).toBe('support')
		expect(manifest.metadata?.runtime).toBe('worker')
		expect(manifest.metadata?.evaluation).toEqual({ suite: 'smoke' })
		expect(manifest.httpExposure?.public).toBe(true)
	})

	it('builds a definition with model aliases and creates an instance', async () => {
		const definition = new AgentBuilder({
			agentName: 'supportAgent',
			agentVersion: '1',
			description: 'Support assistant',
		})
			.addPayloadSchema(
				z.object({
					prompt: z.string(),
				}),
			)
			.defineModel('echo')
			.persistConversation({ storeName: 'aiConversation', maxFrames: 10 })
			.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
			.setStreamingMode('chunked')
			.setHandler<{ prompt: string }>(async (context, payload) => {
				const result = await context.models.echo.generate({ prompt: payload.prompt })
				context.stream.sendFinal(result.output)
				return { message: result.output }
			})
			.build()

		expect(definition.getManifest().models).toEqual(['echo'])

		const instance = await definition.getInstance(
			{
				instanceId: 'bridge-1',
				invoke: async () => [],
			} as any,
			{
				models: {
					echo: new EchoProvider(),
				},
			},
		)
		expect(instance).toBeDefined()
	})

	it('supports persistConversation presets with optional overrides', () => {
		const userPresetDefinition = new AgentBuilder({
			agentName: 'presetAgent',
			agentVersion: '1',
		})
			.persistConversation('user')
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		expect(userPresetDefinition.getManifest().session).toEqual({
			storeName: 'presetAgent:1:user:history',
			strategy: 'full',
			maxFrames: 40,
		})

		const agentPresetDefinition = new AgentBuilder({
			agentName: 'presetAgent',
			agentVersion: '1',
		})
			.persistConversation('agent', { maxFrames: 5, storeName: 'custom-agent-history' })
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		expect(agentPresetDefinition.getManifest().session).toEqual({
			storeName: 'custom-agent-history',
			strategy: 'summary',
			maxFrames: 5,
		})
	})

	it('fails fast when required model aliases are missing at getInstance()', async () => {
		const definition = new AgentBuilder({ agentName: 'missingModelAgent', agentVersion: '1' })
			.defineModel('missing')
			.setHandler(async () => ({ message: 'ok' }))
			.build()

		const eventBridge = new DefaultEventBridge()
		bridges.push(eventBridge)
		await eventBridge.start()

		await expect(definition.getInstance(eventBridge, { models: {} })).rejects.toThrow(
			'Missing model provider for alias "missing"',
		)
	})
})
