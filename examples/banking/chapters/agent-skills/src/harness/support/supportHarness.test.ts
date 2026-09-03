import { defineHarness, inMemorySandbox } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportHarness } from './supportHarness.js'

const usage = { inputTokens: 6, outputTokens: 5, totalTokens: 11 }

describe('support Skill', () => {
	it('mounts the reviewed Skill and exposes only the read built-in', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {},
			toolCalls: [{ id: 'read-skill', name: 'read', arguments: { path: '/skills/support-methods/SKILL.md' } }],
			usage,
			finishReason: 'tool_calls',
		})
		provider.enqueueObject({
			object: {
				answer: 'A pending transfer can remain under review for up to two business days.',
				method: 'pending_transfer',
			},
			usage,
			finishReason: 'stop',
		})
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake-support' } },
			sandbox: inMemorySandbox(),
		})

		try {
			const session = await runtime.getSession('support-skill:request-1')
			const outcome = await session.agents.answer_procedure_question.run({
				requestId: 'request-1',
				question: 'How long can a transfer stay pending?',
			})
			expect(outcome).toMatchObject({
				status: 'completed',
				output: { method: 'pending_transfer' },
			})
			const firstRequest = provider.requests[0]
			if (!('messages' in firstRequest) || !('tools' in firstRequest))
				throw new Error('Expected an object model request.')
			expect(firstRequest.messages[0]?.content).toContain('Location: /skills/support-methods/SKILL.md')
			expect(firstRequest.messages[0]?.content).not.toContain('normal review window')
			expect(firstRequest.tools?.map((tool) => tool.name) ?? []).toEqual(['read'])
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})

	it('fails closed when a configured Skill directory is missing', async () => {
		const invalid = defineHarness({ name: 'missing-skill' })
			.skills({ 'support-methods': { directory: '/path/that/does/not/exist' } })
			.define()

		await expect(invalid.getInstance({ models: {}, sandbox: inMemorySandbox() })).rejects.toMatchObject({
			code: 'SKILL_MANIFEST_ERROR',
		})
	})
})
