import { describe, expect, it } from 'vitest'
import { toAiSdkStreamEvents } from './aiSdkStream.js'
import { createActor, createMessageFrame, createProtocolEnvelope, createTelemetryFrame } from './helpers.js'

describe('toAiSdkStreamEvents', () => {
	const baseEnvelope = () =>
		createProtocolEnvelope({
			conversationId: 'conv-1',
			actor: createActor({ service: 'agent.demo', version: '1' }),
			frame: createMessageFrame({ role: 'assistant', content: 'hello', partial: true }),
		})

	it('emits response lifecycle events with telemetry', async () => {
		const envelopes = [
			baseEnvelope(),
			createProtocolEnvelope({
				conversationId: 'conv-1',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'final text', final: true, summary: 'done' }),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-1',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createTelemetryFrame({
					usage: { promptTokens: 5, completionTokens: 7, totalTokens: 12 },
					durationMs: 123,
					provider: 'openai:',
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes)) {
			events.push(event)
		}

		expect(events.map(item => item.event)).toEqual([
			'response.created',
			'response.output_text.delta',
			'response.output_text.delta',
			'response.metadata.delta',
			'response.completed',
		])

		const completed = events.at(-1)
		expect(completed?.data).toMatchObject({
			output_text: 'final text',
			summary: 'done',
			telemetry: {
				usage: { promptTokens: 5, completionTokens: 7, totalTokens: 12 },
				provider: 'openai:',
			},
		})
	})

	it('emits error event and stops processing', async () => {
		const errorEnvelope = createProtocolEnvelope({
			conversationId: 'conv-2',
			actor: createActor({ service: 'agent.demo', version: '1' }),
			frame: {
				kind: 'error',
				code: 'ToolError',
				message: 'failed',
				handled: false,
			},
		})

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents([errorEnvelope])) {
			events.push(event)
		}

		expect(events.map(item => item.event)).toEqual(['response.created', 'response.error'])
	})
})
