import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { AgentBuilder } from '../builder/AgentBuilder.js'
import { createAgentTestHarness } from './createAgentTestHarness.js'
import { ScriptedModel } from './ScriptedModel.js'

describe('createAgentTestHarness', () => {
	it('normalizes inline runs', async () => {
		const definition = new AgentBuilder({
			agentName: 'inlineHarnessAgent',
			agentVersion: '1',
		})
			.addPayloadSchema(z.object({ prompt: z.string() }))
			.defineModel('openai:test', { capabilities: ['text', 'stream'] })
			.setHandler(async (context, payload) => {
				const output = await context.ai.models['openai:test'].generateText?.({
					prompt: payload.prompt,
				})
				context.io.stream.sendFinal(output ?? '')
				return { message: output ?? '' }
			})
			.build()

		const harness = await createAgentTestHarness(definition, {
			models: {
				'openai:test': new ScriptedModel().nextText('inline reply'),
			},
		})

		try {
			const result = await harness.run({ payload: { prompt: 'hello' } })
			expect(result.finalMessage).toBe('inline reply')
			expect(result.frames.length).toBeGreaterThan(0)
		} finally {
			await harness.destroy()
		}
	})

	it('normalizes queued runs and exposes run-state artifacts', async () => {
		const definition = new AgentBuilder({
			agentName: 'queuedHarnessAgent',
			agentVersion: '1',
		})
			.addPayloadSchema(z.object({ prompt: z.string(), sessionId: z.string().optional() }))
			.setExecutionMode('queued')
			.setExecutionPolicy({
				httpBehavior: 'attach-and-stream',
				recovery: 'resume-from-checkpoints',
				scopeFromPayload: ['sessionId'],
			})
			.setHandler(async (context, payload) => {
				const run = await context.memory.run.start({ title: 'Queued harness run' })
				await run.plan([{ id: 'answer', title: 'Answer request' }])
				await run.completeTask('answer', payload.prompt.toUpperCase())
				await run.finishSuccess(payload.prompt.toUpperCase())
				context.io.stream.sendFinal(payload.prompt.toUpperCase())
				return { message: payload.prompt.toUpperCase() }
			})
			.build()

		const harness = await createAgentTestHarness(definition)

		try {
			const result = await harness.run({
				payload: { prompt: 'queued', sessionId: 'session-1' },
			})
			expect(result.finalMessage).toBe('QUEUED')
			expect(result.runStateArtifacts.length).toBeGreaterThan(0)
		} finally {
			await harness.destroy()
		}
	})
})
