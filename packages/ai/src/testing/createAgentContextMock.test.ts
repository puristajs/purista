import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { createAgentContextMock } from './createAgentContextMock.js'
import { getFinalAssistantText, getRunStateArtifacts } from './protocolTestHelpers.js'

describe('createAgentContextMock', () => {
	it('creates a strict runtime context with tools, agents, expose helpers, and run state', async () => {
		const skillResource = {
			list: async () => [
				{
					name: 'purista-architecture',
					description: 'Architecture guidance',
					path: '/skills/purista-architecture/SKILL.md',
					references: ['decision-matrix.md'],
					scripts: [],
					assets: [],
				},
			],
			load: async () => ({
				name: 'purista-architecture',
				description: 'Architecture guidance',
				path: '/skills/purista-architecture/SKILL.md',
				references: ['decision-matrix.md'],
				scripts: [],
				assets: [],
				content: 'Use services and queues.',
			}),
			loadMany: async () => [
				{
					name: 'purista-architecture',
					description: 'Architecture guidance',
					path: '/skills/purista-architecture/SKILL.md',
					references: ['decision-matrix.md'],
					scripts: [],
					assets: [],
					content: 'Use services and queues.',
				},
			],
			loadReferences: async () => [
				{
					skillName: 'purista-architecture',
					path: '/skills/purista-architecture/references/decision-matrix.md',
					relativePath: 'references/decision-matrix.md',
					content: 'Pick queues for durable work.',
				},
			],
			loadBundle: async () => ({
				skill: {
					name: 'purista-architecture',
					description: 'Architecture guidance',
					path: '/skills/purista-architecture/SKILL.md',
					references: ['decision-matrix.md'],
					scripts: [],
					assets: [],
				},
				files: [
					{
						skillName: 'purista-architecture',
						path: '/skills/purista-architecture/SKILL.md',
						relativePath: 'SKILL.md',
						content: Buffer.from('Use services and queues.', 'utf8'),
					},
				],
			}),
			search: async () => [
				{
					name: 'purista-architecture',
					description: 'Architecture guidance',
					path: '/skills/purista-architecture/SKILL.md',
					references: ['decision-matrix.md'],
					scripts: [],
					assets: [],
					content: 'Use services and queues.',
				},
			],
		}

		const mock = createAgentContextMock({
			payload: { prompt: 'reset password' },
			parameter: { locale: 'en' },
			manifest: {
				agentName: 'supportAgent',
				agentVersion: '1',
				skills: {
					resourceName: 'skills',
					names: ['purista-architecture'],
				},
			},
			commands: {
				support: {
					'1': {
						lookupFaq: async (payload: { question: string }) => ({ answer: `FAQ:${payload.question}` }),
					},
				},
			},
			agents: {
				triageAgent: {
					'1': {
						text: 'urgent',
						payloadSchema: z.object({ prompt: z.string() }),
					},
				},
			},
			resources: {
				search: { enabled: true },
				skills: skillResource,
			},
			secrets: {
				OPENAI_API_KEY: 'secret',
			},
			configs: {
				model: 'openai:test',
			},
		})

		await expect(mock.context.tools.invoke.support['1'].lookupFaq({ question: 'reset password' })).resolves.toEqual({
			answer: 'FAQ:reset password',
		})
		await expect(
			mock.context.agents.runText({
				agentName: 'triageAgent',
				agentVersion: '1',
				payload: { prompt: 'reset password' },
			}),
		).resolves.toBe('urgent')
		expect(
			Object.keys(
				mock.context.expose.tools({
					commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
				}),
			),
		).toEqual(['support.1.lookupFaq'])
		expect(mock.context.expose.metadata().agents).toHaveLength(1)
		expect(mock.context.expose.metadata().agents[0]).toMatchObject({
			agentName: 'triageAgent',
			agentVersion: '1',
			parameterSchema: undefined,
		})
		expect(mock.context.expose.metadata().agents[0]?.payloadSchema).toBeDefined()
		expect(mock.context.resources.search).toEqual({ enabled: true })
		expect(mock.context.skills.names).toEqual(['purista-architecture'])
		await expect(mock.context.skills.list()).resolves.toEqual([
			expect.objectContaining({
				name: 'purista-architecture',
			}),
		])
		await expect(mock.context.skills.search({ queries: ['architecture'] })).resolves.toEqual([
			expect.objectContaining({
				name: 'purista-architecture',
			}),
		])
		await expect(mock.context.skills.loadReferences('purista-architecture')).resolves.toEqual([
			expect.objectContaining({
				relativePath: 'references/decision-matrix.md',
			}),
		])
		await expect(mock.context.secrets.getSecret('OPENAI_API_KEY')).resolves.toBe('secret')
		await expect(mock.context.configs.getConfig('model')).resolves.toBe('openai:test')

		const run = await mock.context.runState.start({ title: 'Test run' })
		await run.plan([{ id: 'lookup', title: 'Lookup answer' }])
		await run.finishSuccess('done')
		await mock.flush()

		expect(getFinalAssistantText(mock.envelopes())).toBe('')
		expect(getRunStateArtifacts(mock.envelopes()).length).toBeGreaterThan(0)
		expect(mock.stubs.commands.support['1'].lookupFaq.calls).toHaveLength(1)
		expect(mock.stubs.agents.triageAgent['1'].calls).toHaveLength(1)
	})

	it('throws for unstubbed resource and secret access', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'strictAgent',
				agentVersion: '1',
			},
		})

		expect(mock.context.skills.available).toBe(false)
		expect(() => mock.context.resources.missing).toThrow('Resource missing is not stubbed')
		await expect(mock.context.skills.list()).rejects.toThrow('No declared skills are configured')
		await expect(mock.context.secrets.getSecret('NOPE')).rejects.toThrow('Secret NOPE is not stubbed')
	})
})
