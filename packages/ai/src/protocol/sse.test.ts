import { describe, expect, it } from 'vitest'

import { createMessageFrame, createProtocolEnvelope } from './helpers.js'
import { toProtocolSseEvents } from './sse.js'

const envelopes = [
	createProtocolEnvelope({
		conversationId: 'conv-1',
		messageId: 'msg-1',
		actor: { service: 'agent', version: '1' },
		frame: createMessageFrame({
			role: 'assistant',
			content: 'hello',
			partial: false,
			final: true,
		}),
	}),
]

describe('toProtocolSseEvents', () => {
	it('converts to ai-sdk responses stream events', async () => {
		const events = []
		for await (const event of toProtocolSseEvents(envelopes, 'ai-sdk-responses')) {
			events.push(event)
		}
		expect(events.some(event => event.event === 'response.created')).toBe(true)
		expect(events.some(event => event.event === 'response.completed')).toBe(true)
	})

	it('supports ai-sdk data protocol alias and emits done marker', async () => {
		const events = []
		for await (const event of toProtocolSseEvents(envelopes, 'ai-sdk-data')) {
			events.push(event)
		}
		expect(events.some(event => event.event === 'data')).toBe(true)
		expect(events.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
	})

	it('maps artifact frames to json-render data-spec parts', async () => {
		const artifactEnvelope = createProtocolEnvelope({
			conversationId: 'conv-json',
			messageId: 'msg-json',
			actor: { service: 'agent', version: '1' },
			frame: {
				kind: 'artifact',
				artifactId: 'spec',
				phase: 'final',
				content: {
					root: 'root-1',
					elements: {
						'root-1': {
							type: 'Card',
							props: {},
							children: [],
						},
					},
				},
				lastChunk: true,
			},
		})

		const events = []
		for await (const event of toProtocolSseEvents([artifactEnvelope], 'ai-sdk-json-render')) {
			events.push(event)
		}
		expect(events.some(event => (event.data as { type?: string })?.type === 'data-spec')).toBe(true)
		expect(events.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
	})

	it('converts to reference agent2agent message events', async () => {
		const events = []
		for await (const event of toProtocolSseEvents(envelopes, 'agent2agent')) {
			events.push(event)
		}
		expect(events).toHaveLength(1)
		expect(events[0]).toMatchObject({
			event: 'message',
			data: {
				threadId: 'conv-1',
			},
		})
	})

	it('converts to a single reference mcp result event', async () => {
		const events = []
		for await (const event of toProtocolSseEvents(envelopes, 'mcp')) {
			events.push(event)
		}
		expect(events).toHaveLength(1)
		expect(events[0]).toMatchObject({
			event: 'result',
			data: {
				content: [{ type: 'text', text: 'hello' }],
			},
		})
	})
})
