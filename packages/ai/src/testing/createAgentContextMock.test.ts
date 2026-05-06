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
				serviceVersion: '1',
				skills: {
					resourceName: 'skills',
					names: ['purista-architecture'],
				},
			},
			commands: {
				support: {
					'1': {
						lookupFaq: async payload => ({ answer: `FAQ:${(payload as { question: string }).question}` }),
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

		await expect(
			mock.context.invoke.tools.invoke.support['1'].lookupFaq({ question: 'reset password' }),
		).resolves.toEqual({
			answer: 'FAQ:reset password',
		})
		await expect(
			mock.context.invoke.agents.runText({
				agentName: 'triageAgent',
				serviceVersion: '1',
				payload: { prompt: 'reset password' },
			}),
		).resolves.toBe('urgent')
		expect(
			Object.keys(
				mock.context.invoke.expose.tools({
					commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
				}),
			),
		).toEqual(['support.1.lookupFaq'])
		expect(mock.context.invoke.expose.metadata().agents).toHaveLength(1)
		expect(mock.context.invoke.expose.metadata().agents[0]).toMatchObject({
			agentName: 'triageAgent',
			serviceVersion: '1',
			parameterSchema: undefined,
		})
		expect(mock.context.invoke.expose.metadata().agents[0]?.payloadSchema).toBeDefined()
		expect(mock.context.app.resources.search).toEqual({ enabled: true })
		expect(mock.context.ai.skills.names).toEqual(['purista-architecture'])
		await expect(mock.context.ai.skills.list()).resolves.toEqual([
			expect.objectContaining({
				name: 'purista-architecture',
			}),
		])
		await expect(mock.context.ai.skills.search({ queries: ['architecture'] })).resolves.toEqual([
			expect.objectContaining({
				name: 'purista-architecture',
			}),
		])
		await expect(mock.context.ai.skills.loadReferences('purista-architecture')).resolves.toEqual([
			expect.objectContaining({
				relativePath: 'references/decision-matrix.md',
			}),
		])
		await expect(mock.context.runtime.stores.secrets.getSecret('OPENAI_API_KEY')).resolves.toBe('secret')
		await expect(mock.context.runtime.stores.configs.getConfig('model')).resolves.toBe('openai:test')

		const run = await mock.context.memory.run.start({ title: 'Test run' })
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
				serviceVersion: '1',
			},
		})

		expect(mock.context.ai.skills.available).toBe(false)
		expect(() => mock.context.app.resources.missing).toThrow('Resource missing is not stubbed')
		await expect(mock.context.ai.skills.list()).rejects.toThrow('No declared skills are configured')
		await expect(mock.context.runtime.stores.secrets.getSecret('NOPE')).rejects.toThrow('Secret NOPE is not stubbed')
	})
})
