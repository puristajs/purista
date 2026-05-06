import { describe, expect, it } from 'vitest'
import { createAgentContextMock } from '../testing/createAgentContextMock.js'

describe('reflection helpers', () => {
	it('accepts on the first critique and emits summary artifacts', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'reflectionAgent',
				serviceVersion: '1',
				reflection: {
					enabledByDefault: true,
					presets: {
						synthesis: {
							maxIterations: 2,
							artifacts: {
								artifactPrefix: 'reflection',
								emitArtifacts: true,
							},
						},
					},
				},
				agentPolicy: {
					quality: {
						defaultProfile: 'synthesis',
						profiles: {
							synthesis: {
								reflection: {
									enabled: true,
									preset: 'synthesis',
								},
							},
						},
					},
				},
			},
		})
		await mock.context.memory.run.start({ title: 'Reflection run' })

		const result = await mock.context.ai.reflect.run({
			name: 'draft-answer',
			profile: 'synthesis',
			draft: async () => 'draft-1',
			critique: async () => ({ accepted: true, notes: ['ok'] }),
			accept: async ({ critique }) => critique.accepted,
		})

		expect(result.accepted).toBe(true)
		expect(result.iterations).toBe(1)
		expect(result.stopReason).toBe('accepted')
		expect(
			mock
				.envelopes()
				.some(envelope => envelope.frame.kind === 'artifact' && envelope.frame.artifactId.endsWith(':summary')),
		).toBe(true)
		expect(mock.stubs.startActiveSpan.calls.some(([name]) => name === 'ai.reflect.run')).toBe(true)
	})

	it('honors an explicit preset passed to reflect.run', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'reflectionAgent',
				serviceVersion: '1',
				reflection: {
					presets: {
						wide: {
							maxIterations: 4,
							artifacts: {
								artifactPrefix: 'review',
								emitArtifacts: true,
							},
						},
					},
				},
			},
		})
		await mock.context.memory.run.start({ title: 'Reflection run' })

		const result = await mock.context.ai.reflect.run({
			name: 'preset-answer',
			preset: 'wide',
			draft: async ({ previousDraft }) => previousDraft ?? 'draft-1',
			critique: async ({ draft }) => ({ accepted: draft === 'draft-2' }),
			accept: async ({ critique }) => (critique as { accepted: boolean }).accepted,
			refine: async ({ draft }) => (draft === 'draft-1' ? 'draft-2' : draft),
		})

		expect(result.iterations).toBe(2)
		expect(
			mock
				.envelopes()
				.some(envelope => envelope.frame.kind === 'artifact' && envelope.frame.artifactId.startsWith('review:')),
		).toBe(true)
	})

	it('refines until acceptance and stops on stagnation', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'reflectionAgent',
				serviceVersion: '1',
			},
		})
		await mock.context.memory.run.start({ title: 'Reflection run' })

		const refined = await mock.context.ai.reflect.run({
			name: 'improve-answer',
			maxIterations: 3,
			draft: async () => 'draft-1',
			critique: async ({ draft }) => ({ accepted: draft === 'draft-2' }),
			accept: async ({ critique }) => (critique as { accepted: boolean }).accepted,
			refine: async ({ draft }) => (draft === 'draft-1' ? 'draft-2' : draft),
		})

		expect(refined.accepted).toBe(true)
		expect(refined.output).toBe('draft-2')
		expect(refined.iterations).toBe(2)

		const stagnant = await mock.context.ai.reflect.run({
			name: 'stagnant-answer',
			maxIterations: 3,
			stopOnStagnation: true,
			draft: async () => 'same',
			critique: async () => ({ accepted: false }),
			accept: async () => false,
			refine: async () => 'same',
		})

		expect(stagnant.accepted).toBe(false)
		expect(stagnant.stopReason).toBe('stagnation')
	})
})
