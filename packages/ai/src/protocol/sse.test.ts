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
		for await (const event of toProtocolSseEvents(envelopes, 'ai-sdk.responses')) {
			events.push(event)
		}
		expect(events.some(event => event.event === 'response.created')).toBe(true)
		expect(events.some(event => event.event === 'response.completed')).toBe(true)
	})

	it('supports ai-sdk ui-message mode and emits done marker', async () => {
		const events = []
		for await (const event of toProtocolSseEvents(envelopes, 'ai-sdk.ui-message')) {
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
		for await (const event of toProtocolSseEvents([artifactEnvelope], 'ai-sdk.ui-message', {
			mapDataParts: envelope => {
				const frame = envelope.frame
				if (frame.kind !== 'artifact') return undefined
				const content = frame.content
				if (typeof content === 'object' && content !== null && 'root' in content && 'elements' in content) {
					return {
						type: 'data-spec',
						data: { type: 'flat', spec: content },
					}
				}
				return undefined
			},
		})) {
			events.push(event)
		}
		expect(events.some(event => (event.data as { type?: string })?.type === 'data-spec')).toBe(true)
		expect(events.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
	})

	it('converts to purista native protocol', async () => {
		const events = []
		for await (const event of toProtocolSseEvents(envelopes, 'purista')) {
			events.push(event)
		}
		expect(events).toHaveLength(1)
		expect(events[0]).toMatchObject({
			event: 'message',
		})
	})
})
