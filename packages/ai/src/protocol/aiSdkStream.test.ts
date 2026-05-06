import { describe, expect, it } from 'vitest'
import { toAiSdkStreamEvents } from './aiSdkStream.js'
import {
	createActor,
	createArtifactFrame,
	createErrorFrame,
	createMessageFrame,
	createProtocolEnvelope,
	createTelemetryFrame,
	createToolEventFrame,
} from './helpers.js'
import { PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID } from './taskArtifacts.js'

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

		expect(events.map(item => item.event)).toEqual(['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'])
		expect(events.map(item => item.data.type)).toEqual([
			'start',
			'start-step',
			'text-start',
			'text-delta',
			'text-delta',
			'text-end',
			'finish-step',
			'finish',
		])
	})

	it('keeps a stable UI text-part id across streamed assistant message envelopes', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-stable-text-id',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'voyage-status',
					phase: 'chunk',
					content: { phase: 'spec-update', status: 'running' },
					mimeType: 'application/json',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-stable-text-id',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'Hello ', partial: true }),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-stable-text-id',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'world', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const textStart = events.find(item => item.data.type === 'text-start')
		const textDeltas = events.filter(item => item.data.type === 'text-delta')
		const textEnd = events.find(item => item.data.type === 'text-end')

		expect(textStart?.data.id).toBeTruthy()
		expect(textDeltas).toHaveLength(2)
		expect(textDeltas[0]?.data.id).toBe(textStart?.data.id)
		expect(textDeltas[1]?.data.id).toBe(textStart?.data.id)
		expect(textEnd?.data.id).toBe(textStart?.data.id)
	})

	it('closes the current text part before finishing a tool step and starts a new one afterwards', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-text-tool-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'Lead-in', partial: true }),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-text-tool-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createToolEventFrame({
					toolName: 'demo.tool',
					status: 'invoked',
					args: { hello: 'world' },
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-text-tool-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createToolEventFrame({
					toolName: 'demo.tool',
					status: 'success',
					result: { ok: true },
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-text-tool-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'Final answer', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const textStarts = events.filter(item => item.data.type === 'text-start')
		const textEnds = events.filter(item => item.data.type === 'text-end')
		const textDeltas = events.filter(item => item.data.type === 'text-delta')
		const toolInputStartIndex = events.findIndex(item => item.data.type === 'tool-input-start')
		const firstTextEndIndex = events.findIndex(item => item.data.type === 'text-end')
		const secondTextStartIndex = events.findIndex(
			(item, index) => item.data.type === 'text-start' && index > toolInputStartIndex,
		)

		expect(textStarts).toHaveLength(2)
		expect(textEnds).toHaveLength(2)
		expect(textStarts[0]?.data.id).not.toBe(textStarts[1]?.data.id)
		expect(textDeltas[0]?.data.id).toBe(textStarts[0]?.data.id)
		expect(textDeltas.at(-1)?.data.id).toBe(textStarts[1]?.data.id)
		expect(firstTextEndIndex).toBeGreaterThan(-1)
		expect(firstTextEndIndex).toBeGreaterThan(toolInputStartIndex)
		expect(secondTextStartIndex).toBeGreaterThan(firstTextEndIndex)
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

	it('emits default data-* parts for artifact frames in ui-message mode', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-status',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'voyage-status',
					phase: 'chunk',
					content: JSON.stringify({
						phase: 'spec-update',
						status: 'active',
						message: 'Tool writeFile',
					}),
					mimeType: 'application/json',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-status',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'done', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const statusEvent = events.find(item => item.event === 'data' && item.data.type === 'data-voyage-status')
		expect(statusEvent).toBeDefined()
		expect(statusEvent?.data).toMatchObject({
			type: 'data-voyage-status',
			data: {
				phase: 'spec-update',
				status: 'active',
				message: 'Tool writeFile',
			},
		})
	})

	it('maps run-state artifacts to data-run-state parts', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-run',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: 'run-state',
					phase: 'chunk',
					content: {
						runId: 'run-1',
						title: 'Architecture Draft',
						status: 'running',
						phase: 'workspace-analysis',
						tasks: [{ id: 'scan', title: 'Scan workspace', status: 'running', order: 0 }],
					},
					mimeType: 'application/json',
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-run',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({ role: 'assistant', content: 'done', final: true }),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const runStateEvent = events.find(item => item.event === 'data' && item.data.type === 'data-run-state')
		expect(runStateEvent?.data).toMatchObject({
			type: 'data-run-state',
			data: {
				runId: 'run-1',
				title: 'Architecture Draft',
				status: 'running',
				phase: 'workspace-analysis',
			},
		})
	})

	it('maps workflow-stage artifacts to data-purista-ai-workflow-stage parts', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-workflow',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createArtifactFrame({
					artifactId: PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
					phase: 'chunk',
					content: {
						type: 'purista-ai-workflow-stage',
						name: 'final-answer',
						status: 'running',
						summary: 'Synthesizing final answer.',
					},
					mimeType: 'application/json',
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const workflowEvent = events.find(
			item => item.event === 'data' && item.data.type === 'data-purista-ai-workflow-stage',
		)
		expect(workflowEvent?.data).toMatchObject({
			type: 'data-purista-ai-workflow-stage',
			data: {
				type: 'purista-ai-workflow-stage',
				name: 'final-answer',
				status: 'running',
				summary: 'Synthesizing final answer.',
			},
		})
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
		expect(types.indexOf('start')).toBeLessThan(types.indexOf('tool-input-start'))
		expect(types).not.toContain('text-start')
		expect(types).toContain('start-step')
		expect(types).toContain('tool-input-start')
		expect(types).toContain('tool-input-delta')
		expect(types).toContain('tool-input-available')
		expect(types).toContain('tool-output-available')
		expect(types).toContain('finish-step')
		expect(events.some(item => item.data.type === 'tool-input-available' && item.data.input !== undefined)).toBe(true)
		expect(events.some(item => item.data.type === 'tool-output-available' && item.data.output !== undefined)).toBe(true)
	})

	it('starts text only when assistant text actually arrives after tool steps', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-tool-then-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createToolEventFrame({
					toolName: 'researchAgent.1.run',
					status: 'invoked',
					args: { prompt: 'find docs' },
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-tool-then-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createToolEventFrame({
					toolName: 'researchAgent.1.run',
					status: 'success',
					result: { ok: true },
				}),
			}),
			createProtocolEnvelope({
				conversationId: 'conv-tool-then-text',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createMessageFrame({
					role: 'assistant',
					content: 'Final synthesized answer.',
					final: true,
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const types = events.filter(item => item.event === 'data').map(item => String(item.data.type))
		const finishStepIndexes = types
			.map((type, index) => (type === 'finish-step' ? index : -1))
			.filter(index => index >= 0)
		expect(types.indexOf('start')).toBeLessThan(types.indexOf('tool-input-start'))
		expect(types.indexOf('tool-input-start')).toBeLessThan(types.indexOf('text-start'))
		expect(finishStepIndexes[0]).toBeLessThan(types.indexOf('text-start'))
		expect(types.indexOf('text-end')).toBeLessThan(finishStepIndexes.at(-1) ?? -1)
		expect(types.indexOf('text-start')).toBeLessThan(types.indexOf('text-delta'))
		expect(types.indexOf('text-delta')).toBeLessThan(types.indexOf('text-end'))
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

	it('maps handled errors to data-agent-error in ui-message mode by default', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-e1',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createErrorFrame({
					code: 'HandledError',
					message: 'validation needs clarification',
					handled: true,
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const dataTypes = events.filter(item => item.event === 'data').map(item => item.data.type)
		expect(dataTypes).toContain('data-agent-error')
		expect(dataTypes).toContain('finish')
		expect(dataTypes).not.toContain('error')
	})

	it('maps unhandled errors to error event in ui-message mode', async () => {
		const envelopes = [
			createProtocolEnvelope({
				conversationId: 'conv-e2',
				actor: createActor({ service: 'agent.demo', version: '1' }),
				frame: createErrorFrame({
					code: 'UnhandledError',
					message: 'fatal execution error',
					handled: false,
				}),
			}),
		]

		const events: Array<{ event: string; data: Record<string, unknown> }> = []
		for await (const event of toAiSdkStreamEvents(envelopes, { mode: 'ui-message' })) {
			events.push(event)
		}

		const dataTypes = events.filter(item => item.event === 'data').map(item => item.data.type)
		expect(dataTypes).toContain('error')
		expect(dataTypes).not.toContain('finish')
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
