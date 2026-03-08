import { describe, expect, it } from 'vitest'
import { toAiSdkStreamEvents } from './aiSdkStream.js'
import {
	createActor,
	createArtifactFrame,
	createMessageFrame,
	createProtocolEnvelope,
	createTelemetryFrame,
	createToolEventFrame,
} from './helpers.js'

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
					waitTimeMs: 5,
					poolId: 'support',
					maxConcurrencyPerInstance: 4,
					activeWorkers: 2,
					waitingWorkers: 1,
					replicaCountHint: 3,
					effectiveMaxConcurrencyHint: 12,
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
				poolId: 'support',
				maxConcurrencyPerInstance: 4,
				effectiveMaxConcurrencyHint: 12,
				provider: 'openai:',
			},
		})
	})

	it('can emit UI-message stream protocol events', async () => {
		const envelopes = [
			baseEnvelope(),
			createProtocolEnvelope({
				conversationId: 'conv-1',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'final text', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		expect(events.map(item => item.event)).toEqual(['data', 'data', 'data', 'data', 'data', 'data'])
		expect(events.map(item => item.data.type)).toEqual([
			'start',
			'text-start',
			'text-delta',
			'text-delta',
			'text-end',
			'finish',
		])
	})

	it('can map protocol frames to custom data-* UI parts', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-9',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'specs/spec.md',
					phase: 'final',
					content: '# Spec',
					mimeType: 'text/markdown',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-9',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'done', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, {
			mode: 'ui-message',
			uiMessage: {
				emitMessageMetadata: false,
				mapDataParts({ frame }) {
					if (frame.kind !== 'artifact') return undefined
					return {
						type: 'data-voyage-artifact',
						data: {
							artifactId: frame.artifactId,
							content: frame.content,
							mimeType: frame.mimeType,
						},
					}
				},
			},
		})) {
			events.push(event)
		}

		const dataTypes = events.filter(item => item.event === 'data').map(item => item.data.type)
		expect(dataTypes).toContain('data-voyage-artifact')
		expect(dataTypes).not.toContain('message-metadata')
		expect(dataTypes).toContain('finish')
	})

	it('maps reasoning artifacts to reasoning-* ui-message events', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-r',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'reasoning',
					phase: 'chunk',
					content: 'step one',
					mimeType: 'text/markdown',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-r',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'done', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const types = events.map(item => item.data.type)
		expect(types).toContain('reasoning-start')
		expect(types).toContain('reasoning-delta')
		expect(types).toContain('reasoning-end')
	})

	it('maps tool frames to tool-* and step ui-message events', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-t',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createToolEventFrame({
					toolName: 'projectWorkspace.1.listProjectFiles',
					status: 'invoked',
					args: { projectId: 'p1' },
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-t',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createToolEventFrame({
					toolName: 'projectWorkspace.1.listProjectFiles',
					status: 'success',
					result: { files: ['specs/spec.md'] },
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const types = events.map(item => item.data.type)
		expect(types).toContain('start-step')
		expect(types).toContain('tool-input-start')
		expect(types).toContain('tool-input-delta')
		expect(types).toContain('tool-input-available')
		expect(types).toContain('tool-output-available')
		expect(types).toContain('finish-step')
	})

	it('maps source and file artifacts to source-url/source-document/file events', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-s',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'source-1',
					phase: 'final',
					content: {
						type: 'source-document',
						url: 'https://example.com/spec',
						mediaType: 'text/markdown',
						title: 'Spec source',
					},
					mimeType: 'text/markdown',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-s',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'image-1',
					phase: 'final',
					content: {
						type: 'file',
						url: 'https://example.com/image.png',
						mediaType: 'image/png',
					},
					mimeType: 'image/png',
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const dataEvents = events.filter(item => item.event === 'data').map(item => item.data)
		expect(dataEvents.some(data => data.type === 'source-url' && data.url === 'https://example.com/spec')).toBe(true)
		expect(dataEvents.some(data => data.type === 'source-document' && data.title === 'Spec source')).toBe(true)
		expect(dataEvents.some(data => data.type === 'file' && data.url === 'https://example.com/image.png')).toBe(true)
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
